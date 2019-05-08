import Vue from 'vue'
import { Store } from 'vuex'
import VueRouter from 'vue-router'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/messaging'

import { RootState } from '~/types/store'
import { Group, UserInfo, ServerGroup } from '~/types/models'
import { IsThisId } from '~/utils/id_helper'
import FirebaseServers from '~/meta/firebase_servers'

/* eslint-disable no-console */
const log = (...args) => process.env.NODE_ENV === 'production' || console.log('FBP', ...args)
/* eslint-enable no-console */

export class FirebasePlugin {
  store: Store<RootState>
  router: VueRouter
  _unwatchCallback: (() => void) | null = null
  _unsubscribeCallback: (() => void) | null = null

  constructor(store: Store<RootState>, router: VueRouter) {
    this.store = store
    this.router = router

    const config_name = this.store.state.options.firebase_server
    log(`🔥 Connecting to firebase server <${config_name}>`)
    firebase.initializeApp(FirebaseServers[config_name])
  }

  get auth() {
    return firebase.auth()
  }
  get db() {
    return firebase.firestore()
  }
  get functions() {
    return firebase.functions()
  }
  get messaging() {
    return firebase.messaging()
  }
  get me(): UserInfo | undefined {
    return this.store.getters['user/me']
  }
  get uid(): string | undefined {
    return this.store.getters['user/uid']
  }

  /**
   * Initialize firebase plugins, register auth listeners
   *
   * @memberof FirebasePlugin
   */
  async init() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        log('🙋 Login with uid:', user.uid)

        const info: UserInfo = {
          uid: user.uid,
          email: user.email || undefined,
          name: user.displayName || '',
          avatar_url: user.photoURL || undefined,
          anonymous: user.isAnonymous,
        }
        await this.uploadProfileAndLogin(info)
        await this.subscribe()
        this.watchStoreChanges()
      }
      else {
        log('🙁 Logout')
        this.unsubscribe()
        this.unwatchStore()
        this.store.commit('user/logout')
        this.store.commit('group/removeOnlineGroups')
      }
    })

    await this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

    await this.updateMessagingToken()

    this.messaging.onMessage((data) => {
      log('📢 Incoming Message:', data)
    })
  }

  async signup(email: string, password: string) {
    return await this.auth.createUserWithEmailAndPassword(email, password)
  }

  async loginWithEmail(email: string, password: string) {
    return await this.auth.signInWithEmailAndPassword(email, password)
  }

  async loginWith(providerName: 'google'|'facebook'|'github') {
    const providers = {
      google: () => new firebase.auth.GoogleAuthProvider(),
      facebook: () => new firebase.auth.FacebookAuthProvider(),
      github: () => new firebase.auth.GithubAuthProvider(),
    }

    const provider = providers[providerName]()

    try {
      // For some reasons, popups are not functional in Electron
      // refer to: https://github.com/firebase/firebase-js-sdk/issues/1334
      if (process.env.BUILD_TARGET === 'electron')
        await this.auth.signInWithRedirect(provider)

      return await this.auth.signInWithPopup(provider)
    }
    catch (e) {
      throw e
    }
  }

  async logout() {
    await this.auth.signOut()
  }

  async publishGroup(id) {
    const group = this.store.getters['group/id'](id) as Group

    const result = await this.functions.httpsCallable('publishGroup')({ group })
    const serverid = (result.data || {}).id
    if (typeof serverid === 'string' && IsThisId.OnlineGroup(serverid)) {
      this.store.commit('group/remove', id)
      await this.manualSync(serverid)
      this.store.commit('group/switch', serverid)
      this.router.push(`/group/${serverid}`)
    }
  }

  async deleteGroup(id: string) {
    // if it's online group, invoke server function
    if (this.store.getters['group/id'](id).online)
      await this.functions.httpsCallable('removeGroup')(id)
    else
      this.store.commit('group/remove', id)
  }

  async requestNotificationPermission() {
    try {
      await this.messaging.requestPermission()
      return await this.updateMessagingToken()
    }
    catch (error) {
      console.error(error)
    }
  }

  async updateMessagingToken() {
    const token = await this.messaging.getToken()
    this.store.commit('setMessagingToken', token)
    if (token)
      log(`📢 Messaging enabled with token: ${token}`)

    if (!token || !this.uid)
      return token

    // async update tokens to firestore
    this.db
      .collection('messaging_tokens')
      .doc(this.uid)
      // TODO: merge with other tokens
      .set({ tokens: [token] })
    return token
  }

  subscribe() {
    this.unsubscribe()
    this._unsubscribeCallback = this.db
      .collection('groups')
      .where('viewers', 'array-contains', this.uid)
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          // ignore local change
          if (change.doc.metadata.hasPendingWrites)
            return

          // updates from server
          const data = change.doc.data() as ServerGroup
          log(`🌠 Incoming change <${change.type}>`, data.id, data)
          if (change.type === 'modified' || change.type === 'added') {
            this.store.commit('group/onServerUpdate', {
              data,
              timestamp: +new Date(),
            })
            // update viewers profile async
            this.updateUserProfiles(data.viewers)
          }
          else if (change.type === 'removed') {
            this.store.commit('group/remove', data.id)
          }
        })
      })
    log('📻 Firebase subscribed')
  }

  unsubscribe() {
    if (this._unsubscribeCallback) {
      log('🔕 Firebase unsubscribed')
      this._unsubscribeCallback()
    }
  }

  async joinGroup(id: string) {
    if (this.store.getters['group/all'].map(g => g.id).indexOf(id) === -1) {
      await this.functions.httpsCallable('joinGroup')({ id })
      await this.manualSync(id)
    }
    this.router.push(`/group/${id}`)
  }

  async manualSync(id: string) {
    const doc = await this.db
      .collection('groups')
      .doc(id)
      .get()

    this.store.commit('group/onServerUpdate', {
      data: doc.data(),
      timestamp: +new Date(),
    })
  }

  /**
   * Upload user profile to the server
   *
   * @param {UserInfo} [profile] user profile, if not set, the profile form store will bse used
   * @param {boolean} [force] if set, the data will be write to server regardless the timestamp
   * @returns
   * @memberof FirebasePlugin
   */
  async uploadProfileAndLogin(profile?: UserInfo, force?: boolean) {
    const me = profile || this.me
    const uid = me && me.uid
    const lastupdate = (this.me && this.me.lastupdate) || 0

    if (!me || !uid)
      return

    const doc = this.db
      .collection('users')
      .doc(uid)
    const upload = async () => {
      me.lastupdate = +new Date()
      await doc.set(me)
      this.store.commit('user/login', me)
      log('😶 Profile uploaded')
    }
    if (force)
      return await upload()

    // Not profile store in server, upload
    const serverProfile = await doc.get()
    if (!serverProfile.exists)
      return await upload()
    const serverProfileData = serverProfile.data()
    if (!serverProfileData)
      return await upload()

    // Server profile is newer, update local
    if (serverProfileData.lastupdate === lastupdate) {
      this.store.commit('user/login', me)
      log('😶 No changes on profile, skipped')
    }
    else if (serverProfileData.lastupdate > lastupdate) {
      this.store.commit('user/login', serverProfileData)
      log('😶 Profile updated from server', lastupdate, serverProfileData)
    }
    else {
      return await upload()
    }
  }

  async downloadProfile(uid: string) {
    try {
      const doc = await this.db
        .collection('users')
        .doc(uid)
        .get()
      const user = doc.data() as UserInfo
      user.lastsync = +new Date()
      this.store.commit('user/profileUpdate', { uid, user })
      log('🎃 Profile of ', uid, ' updated ', user)
    }
    catch (e) {
      log(`🐛 Error on download profile of ${uid}`)
      console.error(e)
    }
  }

  async updateUserProfiles(uids: string[], threshold = 1000 * 60 * 60 * 24) {
    const now = +new Date()
    for (const uid of uids) {
      // skip profile updates for user self
      if (uid === this.uid)
        continue

      // if local user lastupdate expire the threshold, update from server
      const user = this.store.getters['user/user'](uid) as UserInfo
      if (!user || !user.lastupdate || (now - user.lastupdate) > threshold)
        this.downloadProfile(uid)
    }
  }

  async groupMeta(id: string): Promise<object|null> {
    const result = await this.functions.httpsCallable('groupMeta')({ id })
    if (result)
      return result.data || null
    return null
  }

  watchStoreChanges() {
    this._unwatchCallback = this.store.watch(
      (state) => {
        return state.group.groups
      }, (value) => {
        Object.values(value).forEach(async (group) => {
          if (!group.online)
            return

          const unsynced = this.store.getters['group/unsyncedOperationsOf'](group.id)

          if (!unsynced.length)
            return

          const payload = {
            id: group.id,
            operations: unsynced,
            lastsync: group.lastsync,
          }
          this.store.commit('group/syncOperations', { id: group.id, operations: unsynced })
          log('🚀 Outcoming operations', payload)
          await this.functions.httpsCallable('uploadOperations')(payload)
        })
      }, {
        deep: true,
        immediate: true,
      }
    )
    log('📻 Store watched')
  }

  unwatchStore() {
    if (this._unwatchCallback) {
      log('🔕 Store unwatched')
      this._unwatchCallback()
    }
  }
}

export default async (context: any) => {
  const store = context.store
  const fire = new FirebasePlugin(store, context.app.router)
  fire.init()
  Vue.prototype.$fire = fire
}
