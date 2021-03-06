import Vue from 'vue'
import { Store } from 'vuex'
import VueRouter from 'vue-router'
import nanoid from 'nanoid'
import dayjs from 'dayjs'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/messaging'

import { SharedGroupOptions } from '../../types/models'
import { FallbackExchangeRate } from '../../meta/fallback_exchange_rates'
import { RootState, Group, UserInfo, ServerGroup, ClientGroup, Feedback, FeedbackOptions, ExchangeRecord, Operation, NotificationMessage } from '~/types'
import { IsThisId, getExchangeRateOn } from '~/core'

import FirebaseServerConfig, { CurrentServerName } from '~/../meta/firebase_servers'
import { DEBUG, BUILD_TARGET } from '~/../meta/env'
import { resizeImageFile, resizeImageBlob } from '~/../shared/utils/image'

firebase.initializeApp(FirebaseServerConfig)

// eslint-disable-next-line no-console
const log = (...args) => !DEBUG || console.log('FBP', ...args)

export class FirebasePlugin {
  store: Store<RootState>
  router: VueRouter
  _unwatchCallback: (() => void) | null = null
  _unsubscribeCallback: (() => void) | null = null
  _initialized = false
  _initializedCallbacks: Function[] = []

  constructor(store: Store<RootState>, router: VueRouter) {
    this.store = store
    this.router = router
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

  get storage() {
    return firebase.storage()
  }

  get messaging() {
    if (this.messagingEnabled)
      return firebase.messaging()
    else
      return null
  }

  get me(): UserInfo | undefined {
    return this.store.getters['user/me']
  }

  get uid(): string | undefined {
    return this.store.getters['user/uid']
  }

  get messagingEnabled() {
    return this.store.state.ua.os !== 'ios'
  }

  /**
   * Initialize firebase plugins, register auth listeners
   *
   * @memberof FirebasePlugin
   */
  async init() {
    await Promise.all([
      import('firebase/auth'),
      import('firebase/functions'),
      import('firebase/storage'),
    ])

    log(`🔥 Connecting to firebase server <${CurrentServerName}>`)

    this.auth.onAuthStateChanged(async(user) => {
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
        this.registerMessagingToken()
      }
      else {
        log('🙁 Logout')
        this.unsubscribe()
        this.unwatchStore()
        this.unregisterMessagingToken()
        this.store.commit('user/logout')
        this.store.dispatch('group/removeOnlineGroups')
      }
      this.initialized()
    })

    await this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

    if (this.messaging) {
      this.messaging.onMessage((data: NotificationMessage) => {
        log('📢 Incoming Message:', data)
        const notification = data.notification
        // refering to: https://web-push-book.gauntface.com/chapter-05/02-display-a-notification
        if (this.messagingEnabled && notification)
          // eslint-disable-next-line no-new
          new Notification(notification.title, notification)
      })
    }
  }

  waitForInitialized() {
    return new Promise((resolve) => {
      if (this._initialized)
        resolve()
      else
        this._initializedCallbacks.push(resolve)
    })
  }

  private initialized() {
    this._initialized = true
    this._initializedCallbacks.forEach((callback) => {
      try { callback() }
      catch {}
    })
    this._initializedCallbacks = []
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

    // For some reasons, popups are not functional in Electron
    // refer to: https://github.com/firebase/firebase-js-sdk/issues/1334
    if (BUILD_TARGET === 'electron' || (this.store.state.ua.os === 'ios')) {
      await this.auth.signInWithRedirect(provider)
      return firebase.auth().getRedirectResult()
    }

    return await this.auth.signInWithPopup(provider)
  }

  async logout() {
    await this.auth.signOut()
  }

  async publishGroup(id: string) {
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

  async uploadImage(groupid: string, transid: string, file: File, imageid = nanoid(10)): Promise<string> {
    const ref = this.storage.ref().child(`transactions/${groupid}/${transid}/${imageid}`)
    const resized = await resizeImageFile(file, { maxHeight: 1080, maxWidth: 1080 })
    if (!resized)
      return ''
    await ref.put(resized)
    return await ref.getDownloadURL()
  }

  async uploadAvatar(base64: string): Promise<string> {
    const ref = this.storage.ref().child(`users/${this.uid}`)
    const resized = await resizeImageBlob(base64, { maxHeight: 128, maxWidth: 128 })
    if (!resized)
      return ''
    await ref.put(resized)
    return await ref.getDownloadURL()
  }

  async requestNotificationPermission() {
    try {
      if (!this.messaging)
        return
      await this.messaging.requestPermission()
      return await this.registerMessagingToken()
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  async changeGroupOptions(id: string, changes: Partial<SharedGroupOptions>) {
    const group = this.store.getters['group/clientGroupById'](id) as ClientGroup
    if (!group || !group.online)
      return
    await this.functions.httpsCallable('changeGroupOptions')({ id, changes })
  }

  async archiveGroupOperations(id: string) {
    await this.functions.httpsCallable('archiveGroupOperations')({ id })
  }

  async registerMessagingToken() {
    if (!this.messaging)
      return null

    const token: string|null = await this.messaging.getToken()
    this.store.commit('setMessagingToken', token)
    if (token)
      log(`📢 Messaging enabled with token: ${token}`)

    if (!token || !this.uid)
      return token

    const locale = this.store.getters.locale
    // async update tokens to firestore
    this.db
      .runTransaction(async(t) => {
        const ref = this.db.collection('messaging_tokens').doc(this.uid)
        const data = (await t.get(ref)).data() || { tokens: [] }
        data.tokens = data.tokens.filter(i => i.token !== token)
        data.tokens.push({
          token,
          locale,
          enabled: true,
        })
        await t.set(ref, data)
      })

    return token
  }

  async unregisterMessagingToken() {
    if (!this.messaging)
      return null

    const token: string | null = await this.messaging.getToken()
    if (!token || !this.uid)
      return token

    this.db
      .runTransaction(async(t) => {
        const ref = this.db.collection('messaging_tokens').doc(this.uid)
        const data = (await t.get(ref)).data() || { tokens: [] }
        data.tokens = data.tokens.filter(i => i.token !== token)
        await t.set(ref, data)
      })

    return token
  }

  async sendFeedback(feedback: FeedbackOptions) {
    const uid = this.uid || null
    const data: Feedback = {
      ...feedback,
      uid,
      timestamp: +new Date(),
    }
    await this.db
      .collection('feedbacks')
      .doc(nanoid())
      .set(data)
  }

  async getExchangeRates(date?: dayjs.ConfigType, fallback_days = 5): Promise<ExchangeRecord> {
    let d = dayjs(date)
    if (d.isAfter(dayjs()))
      d = dayjs()
    d = d.subtract(1, 'day')
    date = d.format('YYYY-MM-DD')
    const cache = this.store.state.cache.exchange_rates[date]
    if (cache)
      return cache
    log(`💱 Requesting exchange rate information on ${date}`)
    try {
      const record = await this.functions.httpsCallable('getExchangeRate')({ date })
      if (record.data) {
        this.store.commit('cache/save', { type: 'exchange_rates', key: date, data: record.data })
        log(`💱 Exchange rate information on ${date} received`, record.data)
        return record.data
      }
    }
    catch {}
    if (fallback_days <= 0)
      return FallbackExchangeRate
    return await this.getExchangeRates(d.subtract(1, 'day'), fallback_days - 1)
  }

  getExchangeRatesSync(date?: dayjs.ConfigType, fallback_days = 30): ExchangeRecord {
    let d = dayjs(date)
    // if it's future, use today
    if (d.isAfter(dayjs()))
      d = dayjs()
    // if it's today, we should use yesterday's exchange rate
    if (d.isSame(dayjs(), 'day'))
      d = d.subtract(1, 'day')

    date = d.format('YYYY-MM-DD')
    const cache = this.store.state.cache.exchange_rates[date]
    if (cache)
      return cache
    if (fallback_days <= 0)
      return FallbackExchangeRate
    return this.getExchangeRatesSync(d.subtract(1, 'day'), fallback_days - 1)
  }

  async getExchangeRateOn(from: string, to: string, date?: dayjs.ConfigType, fallback_days?: number) {
    const record = await this.getExchangeRates(date, fallback_days)
    return getExchangeRateOn(from, to, record)
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
            this.store.dispatch('group/onServerUpdate', {
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

  async joinGroup(id: string, localmemberId?: string) {
    if (!this.store.getters['group/all'].map(g => g.id).includes(id)) {
      await this.functions.httpsCallable('joinGroup')({ id, join_as: localmemberId })
      await this.manualSync(id)
    }
    this.router.push(`/group/${id}`)
  }

  async manualSync(id: string) {
    const doc = await this.db
      .collection('groups')
      .doc(id)
      .get()

    this.store.dispatch('group/onServerUpdate', {
      data: doc.data(),
      timestamp: +new Date(),
    })
  }

  async uploadMyProfile() {
    if (!this.me || !this.uid)
      return

    console.log('UPLOADING', this.me)

    const doc = this.db
      .collection('users')
      .doc(this.uid)
    await doc.set(this.me)
    log('😶 Profile uploaded')
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

    const onlineData = (await doc.get()).data()

    if (onlineData?.custom) {
      this.store.commit('user/login', onlineData)
      return
    }

    const upload = async() => {
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
    if (IsThisId.LocalMember(uid))
      return
    if (IsThisId.Me(uid))
      return
    try {
      const doc = await this.db
        .collection('users')
        .doc(uid)
        .get()
      if (!doc.exists) {
        log(`🐛 Profile of ${uid} not found`)
        return
      }
      const user = doc.data() as UserInfo
      user.lastsync = +new Date()
      this.store.commit('user/profileUpdateFromServer', { uid, user })
      log('🎃 Profile of ', uid, ' updated ', user)
    }
    catch (e) {
      log(`🐛 Error on download profile of ${uid}`)
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  async updateUserProfiles(uids: string[], threshold_hours = 24) {
    const now = +new Date()
    for (const uid of uids) {
      // skip profile updates for user self
      if (uid === this.uid)
        continue

      const threshold = threshold_hours * 60 * 60 * 1000
      // if local user lastupdate expire the threshold, update from server
      const user = this.store.getters['user/user'](uid) as UserInfo
      if (!user || !user.lastsync || (now - user.lastsync) > threshold)
        this.downloadProfile(uid)
    }
  }

  async groupInfo(id: string): Promise<ServerGroup|null> {
    try {
      const result = await this.db
        .collection('groups')
        .doc(id)
        .get()

      if (result && result.data())
        return result.data() as ServerGroup

      return null
    }
    catch (e) {
      return null
    }
  }

  uploadLocalChanges(groups?: ClientGroup[]) {
    if (!groups)
      groups = Object.values(this.store.state.group.groups)

    return Promise.all(
      groups.map(async(group) => {
        if (!group.online)
          return

        const isUnsynced = (o: Operation) => !(group.syncing_operations || []).includes(o.hash)
        const unsynced = group.operations.filter(isUnsynced)

        if (!unsynced.length)
          return

        const payload = {
          id: group.id,
          operations: unsynced,
          lastsync: group.lastsync,
        }
        this.store.commit('group/updateSyncingState', { id: group.id, syncing_operations: unsynced.map(i => i.hash) })
        log('🚀 Outcoming operations', payload)

        try {
          await this.functions.httpsCallable('uploadOperations')(payload)
        }
        catch (e) {
          this.store.commit('group/updateSyncingState', { id: group.id, syncing_error: e })
        }
      }))
  }

  watchStoreChanges() {
    this.store.commit('group/resetSyncingStates')

    this._unwatchCallback = this.store.watch(
      (state) => {
        return Object.values(state.group.groups).map(g => g.operations)
      }, () => {
        this.uploadLocalChanges()
      }, {
        deep: true,
        immediate: true,
      },
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

export default async(context: any) => {
  const store = context.store
  const fire = new FirebasePlugin(store, context.app.router)
  Vue.prototype.$fire = fire
  // @ts-ignore
  window.onNuxtReady(() => {
    fire.init()
  })
}
