import Vue from 'vue'
import { Store } from 'vuex'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

import { GenerateId } from '../utils/randomstr'
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

  async switchToOnline({ groupid, memberid }: {groupid: string; memberid?: string}) {
    if (!memberid) {
      const group = this.store.getters['group/id'](groupid) as Group
      memberid = Object.keys(group.members)[0]
    }
    const onlineId = GenerateId.OnlineGroup()
    this.store.dispatch('group/switchToOnline', {
      localId: groupid,
      onlineId,
      switchTo: true,
      memberLocalId: memberid,
    })
    await this.syncGroup(onlineId)
  }

  async syncGroup(groupid: string) {
    /*
    log(groupid, 'Start syncing ')
    const snap = await db.collection('groups').doc(groupid).get()

    const onlineExists = snap.exists
    const localExists = !!this.store.state.group.groups[groupid]
    log(groupid, `Online:${onlineExists ? '✔️' : '❌'}, Local:${localExists ? '✔️' : '❌'}`)

    if (!onlineExists && localExists)
      await db.collection('groups').doc(groupid).set(this.store.state.group.groups[groupid])
    else if (!localExists)
      this.store.commit('group/onServerUpdate', { id: groupid, data: snap.data() })

    this.pushGroup(groupid)
    this.subscribeGroup(groupid)
    log(groupid, 'Subscribed')
    */
  }

  async deleteGroup(groupid: string) {
    await db.collection('groups').doc(groupid).delete()
  }

  subscribeGroup(groupid: string) {
    db.collection('groups')
      .doc(groupid)
      .onSnapshot((snap) => {
        log(groupid, '🌠 Incoming update', snap)
        this.store.commit('group/onServerUpdate', { id: groupid, data: snap.data() })
      })
  }

  pushGroup(groupid: string) {
    /*
    this.store.watch(
      (state) => {
        return state.group.groups[groupid]
      },
      (val) => {
        log(groupid, '🚀 Outgoing update', val)
        db.collection('groups')
          .doc(groupid)
          .set(val)
      },
      {
        deep: true,
      }
    )
    */
  }

  async fetchAllGroups(subscribe?: boolean) {
    const snap = await db
      .collection('groups')
      .where('memberIds', 'array-contains', this.store.getters['user/info'].uid)
      .get()

    if (subscribe) {
      const ids = snap.docs.map(d => d.id)
      const localIds = Object.keys(this.store.state.group.groups)
        .filter(id => ids.indexOf(id) < 0 && this.store.state.group.groups[id].online)
      ids.concat(localIds)
        .forEach((id) => {
          this.syncGroup(id)
        })
    }
    else {
      for (const doc of snap.docs)
        this.store.commit('group/onServerUpdate', { id: doc.id, data: doc.data() })
    }
    return snap.docs.map(d => d.data())
  }

  async joinGroup(groupid: string) {
    await functions.httpsCallable('joinGroup')({ groupid })
    await this.syncGroup(groupid)
  }
}

export default async ({ store }: { store: Store<RootState> }) => {
  const fire = new FirebasePlugin(store)
  Vue.prototype.$fire = fire

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      log('Login with uid:', user.uid)
      store.commit('user/login', user)
      await fire.fetchAllGroups(true)
    }
    else {
      log('Logout')
      store.commit('user/logout')
      store.commit('group/removeOnlineGroups')
    }
  })

  await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
}
