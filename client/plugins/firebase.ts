import Vue from 'vue'
import { Store } from 'vuex'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

import { RootState } from '~/types/store'
import { Group } from '~/types/models'

const config = {
  apiKey: 'AIzaSyCGr9QtZjJSsomlM5pTkqiPzeCYr_kQqk4',
  authDomain: 'splitoast-development.firebaseapp.com',
  databaseURL: 'https://splitoast-development.firebaseio.com',
  projectId: 'splitoast-development',
  storageBucket: 'splitoast-development.appspot.com',
  messagingSenderId: '918223121466',
}

firebase.initializeApp(config)

export const auth = firebase.auth()
export const db = firebase.firestore()
export const functions = firebase.functions()

/* eslint-disable no-console */
const log = (...args) => process.env.NODE_ENV === 'production' || console.log('FBP', ...args)
/* eslint-enable no-console */

const UploadOperations = functions.httpsCallable('uploadOperations')

export class FirebasePlugin {
  store: Store<RootState>
  _unwatchCallback: (() => void) | null = null
  _unsubscribeCallback: (() => void) | null = null

  constructor(store: Store<RootState>) {
    this.store = store
  }

  get auth() {
    return auth
  }
  get db() {
    return db
  }
  get functions() {
    return functions
  }

  async signup(email: string, password: string) {
    return await auth.createUserWithEmailAndPassword(email, password)
  }

  async loginWithEmail(email: string, password: string) {
    return await auth.signInWithEmailAndPassword(email, password)
  }

  async loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    try {
      // For some reasons, popups are not functional in Electron
      // refer to: https://github.com/firebase/firebase-js-sdk/issues/1334
      if (process.env.BUILD_TARGET === 'electron')
        await auth.signInWithRedirect(provider)

      return await auth.signInWithPopup(provider)
    }
    catch (e) {
      throw e
    }
  }

  async logout() {
    await auth.signOut()
  }

  async publishGroup({ groupid }) {
    const group = this.store.getters['group/id'](groupid) as Group

    const result = await functions.httpsCallable('publishGroup')({ group })
    const serverid = (result.data || {}).id
    if (typeof serverid === 'string' && serverid.startsWith('og-')) {
      this.store.commit('group/remove', groupid)
      await this.manualSync(serverid)
      this.store.commit('group/switch', serverid)
      // this.subscribe()
    }
  }

  async deleteGroup(groupid: string) {
    if (this.store.getters['group/id'](groupid).online)
      await this.functions.httpsCallable('removeGroup')(groupid)
    this.store.commit('group/remove', groupid)
  }

  subscribe() {
    this.unsubscribe()
    const uid = this.store.getters['user/me'].uid
    this._unsubscribeCallback = db
      .collection('groups')
      .where('viewers', 'array-contains', uid)
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          // ignore local change
          if (change.doc.metadata.hasPendingWrites)
            return

          // updates from server
          const data = change.doc.data()
          log(`🌠 Incoming change <${change.type}>`, data.id, data)
          if (change.type === 'modified' || change.type === 'added') {
            this.store.commit('group/onServerUpdate', {
              data,
              timestamp: +new Date(),
            })
          }
          else if (change.type === 'removed') {
            this.store.commit('group/remove', data.id)
          }
        })
      })
    log('📻 Subscribed')
  }

  unsubscribe() {
    if (this._unsubscribeCallback) {
      log('🔕 Unsubscribed')
      this._unsubscribeCallback()
    }
  }

  async joinGroup(groupid: string) {
    await functions.httpsCallable('joinGroup')({ groupid })
  }

  async manualSync(groupid: string) {
    const doc = await db
      .collection('groups')
      .doc(groupid)
      .get()

    this.store.commit('group/onServerUpdate', {
      data: doc.data(),
      timestamp: +new Date(),
    })
  }

  watchStoreChanges() {
    this._unwatchCallback = this.store.watch(
      (state) => {
        return state.group.groups
      }, (value) => {
        Object.values(value).forEach(async (group) => {
          if (group.online && group.operations.length) {
            const payload = {
              id: group.id,
              operations: group.operations,
              lastsync: group.lastsync,
            }
            log('🚀 Outcoming operations', payload)
            await UploadOperations(payload)
          }
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

export default async ({ store }: { store: Store<RootState> }) => {
  const fire = new FirebasePlugin(store)
  Vue.prototype.$fire = fire

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      log('🙋 Login with uid:', user.uid)
      store.commit('user/login', user)
      await fire.subscribe()
      fire.watchStoreChanges()
    }
    else {
      log('🙁 Logout')
      fire.unsubscribe()
      fire.unwatchStore()
      store.commit('user/logout')
      store.commit('group/removeOnlineGroups')
    }
  })

  await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
}
