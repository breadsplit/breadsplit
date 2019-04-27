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

export default ({ store, route, app }) => {
  const fire: FirePlugin = {

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

  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user)
      store.commit('user/login', user)
    else
      store.commit('user/logout')
  })

  Vue.prototype.$fire = fire
}
