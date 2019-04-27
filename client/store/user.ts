import { MutationTree, GetterTree } from 'vuex'
import { RootState, UserState } from '~/types/store'
import { UserStateDefault } from '~/utils/defaults'

export const state = UserStateDefault

export const mutations: MutationTree<UserState> = {

  login(state, user) {
    state.uid = user.uid
    state.email = user.email
    state.display_name = user.displayName
    state.avatar_url = user.photoURL
    state.anonymous = user.isAnonymous
  },

  logout(state, user) {
    Object.assign(state, UserStateDefault())
  },
}

export const getters: GetterTree<UserState, RootState> = {

  info(state) {
    return state
  },

}
