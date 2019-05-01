import { MutationTree, GetterTree } from 'vuex'
import { RootState, UserState } from '~/types/store'
import { UserStateDefault } from '~/utils/defaults'

export const state = UserStateDefault

export const mutations: MutationTree<UserState> = {

  login(state, info) {
    state.me = info
    state.online = true
  },

  logout(state) {
    state.online = false
    state.me = {
      uid: null,
      anonymous: true,
      display_name: '',
    }
  },

  profileUpdate(state, { uid, user }) {
    state.users[uid] = user
  },
}

export const getters: GetterTree<UserState, RootState> = {

  me(state) {
    return state.me
  },

  uid(state) {
    return state.me.uid
  },

  online(state) {
    return state.online
  },

  user: state => (uid) => {
    if (uid === state.me.uid)
      return state.me
    else
      return state.users[uid]
  },
}
