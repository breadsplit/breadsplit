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

export class FirebasePlugin {
  store: Store<RootState>

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

    await functions.httpsCallable('publishGroup')({ group })
    this.subscribe()
  }

  async deleteGroup(groupid: string) {
    // TODO:
  }

  unsubscribe() {
    if (this._unsubscribeCallback)
      this._unsubscribeCallback()
  }

  _unsubscribeCallback: (() => void) | null = null

  subscribe() {
    this.unsubscribe()
    this._unsubscribeCallback = db
      .collection('groups')
      .where('viewers', 'array-contains', this.store.getters['user/info'].uid)
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          const id = change.newIndex.toString()
          const data = change.doc.data()
          log(id, '🌠 Incoming change', change.type, data)
          if (change.type === 'modified' || change.type === 'added') {
            this.store.commit('group/onServerUpdate', {
              id,
              data,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
          }
        })
      })
  }

  async joinGroup(groupid: string) {
    await functions.httpsCallable('joinGroup')({ groupid })
    await this.subscribe()
  }

  async manualSync(groupid: string) {
    // TODO:
  }
}

export default async ({ store }: { store: Store<RootState> }) => {
  const fire = new FirebasePlugin(store)
  Vue.prototype.$fire = fire

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      log('Login with uid:', user.uid)
      store.commit('user/login', user)
      await fire.subscribe()
    }
    else {
      log('Logout')
      store.commit('user/logout')
      store.commit('group/removeOnlineGroups')
    }
  })

  await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
}
