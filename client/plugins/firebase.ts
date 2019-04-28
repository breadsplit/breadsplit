import Vue from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import FirePlugin from '../types/fireplugin'
import { GenerateId } from '../utils/randomstr'

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

export default async ({ store }) => {
  const log = (...args) => process.env.NODE_ENV === 'production' || console.log('FBP', ...args)

  const fire: FirePlugin = {
    auth,
    db,

    async signup(email, password) {
      return await auth.createUserWithEmailAndPassword(email, password)
    },

    async loginWithEmail(email, password) {
      return await auth.signInWithEmailAndPassword(email, password)
    },

    async loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider()

      try {
        // For some reasons, popups are not functional in Electron
        // refer to: https://github.com/firebase/firebase-js-sdk/issues/1334
        if (process.env.BUILD_TARGET === 'electron') {
          await auth.signInWithRedirect(provider)
          throw new Error('should never reach')
        }

        return await auth.signInWithPopup(provider)
      }
      catch (e) {
        throw e
      }
    },

    async logout() {
      await auth.signOut()
    },

    async switchToOnline({ groupid, memberid }) {
      if (!memberid) {
        const group = store.state.group.groups[groupid]
        memberid = Object.keys(group.members)[0]
      }
      const onlineId = GenerateId.OnlineGroup()
      store.dispatch('group/switchToOnline', {
        localId: groupid,
        onlineId,
        switchTo: true,
        memberLocalId: memberid,
      })
      await fire.syncGroup(onlineId)
    },

    async syncGroup(groupid) {
      log(groupid, 'Start syncing ')
      const snap = await db.collection('groups').doc(groupid).get()

      const onlineExists = snap.exists
      const localExists = !!store.state.group.groups[groupid]
      log(groupid, `Online:${onlineExists ? '✔️' : '❌'}, Local:${localExists ? '✔️' : '❌'}`)

      if (!onlineExists && localExists)
        await db.collection('groups').doc(groupid).set(store.state.group.groups[groupid])
      else if (!localExists)
        store.commit('group/onServerUpdate', { id: groupid, data: snap.data() })
      else
        return

      fire.pushGroup(groupid)
      fire.subscribeGroup(groupid)
      log(groupid, 'Subscribed')
    },

    async deleteGroup(groupid) {
      await db.collection('groups').doc(groupid).delete()
    },

    subscribeGroup(groupid) {
      db.collection('groups')
        .doc(groupid)
        .onSnapshot((snap) => {
          store.commit('group/onServerUpdate', { id: groupid, data: snap.data() })
        })
    },

    pushGroup(groupid) {
      store.watch(
        (state) => {
          return state.group.groups[groupid]
        },
        (val) => {
          db.collection('groups')
            .doc(groupid)
            .set(val)
        },
        {
          deep: true,
        }
      )
    },

    async fetchAllGroups(subscribe) {
      const snap = await db
        .collection('groups')
        .where('memberIds', 'array-contains', store.getters['user/info'].uid)
        .get()

      if (subscribe) {
        const ids = snap.docs.map(d => d.id)
        const localIds = Object.keys(store.state.group.groups).filter(id => ids.indexOf(id) < 0 && store.state.group.groups[id].online)
        ids.concat(localIds)
          .forEach((id) => {
            fire.syncGroup(id)
          })
      }
      else {
        for (const doc of snap.docs)
          store.commit('group/onServerUpdate', { id: doc.id, data: doc.data() })
      }
      return snap.docs.map(d => d.data())
    },
  }

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
