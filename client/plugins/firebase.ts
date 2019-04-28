import Vue from 'vue'
import FirePlugin from '~/types/fireplugin'
import * as firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'

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

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

export default ({ store, route, app }) => {
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
        const result = await auth.signInWithPopup(provider)
        return result
      }
      catch (e) {
        throw e
      }
    },

    async logout() {
      await auth.signOut()
    },

    async syncGroup(groupid) {
      const snap = await db.collection('groups').doc(groupid).get()
      if (!store.state.group.groups[groupid] && snap.exists)
        store.commit('group/onServerUpdate', { id: groupid, data: snap.data() })
      if (!snap.exists)
        await db.collection('groups').doc(groupid).set(store.state.group.groups[groupid])

      fire.pushGroup(groupid)
      fire.subscribeGroup(groupid)
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
  }

  auth.onAuthStateChanged((user) => {
    if (user)
      store.commit('user/login', user)
    else
      store.commit('user/logout')
  })

  Vue.prototype.$fire = fire
}
