import { MutationTree, GetterTree } from 'vuex'
import { RootState, UserState } from '~/types/store'
import { UserStateDefault } from '~/utils/defaults'

export const state = UserStateDefault

export const mutations: MutationTree<UserState> = {

  login(state, user) {
    state.info.uid = user.uid
    state.info.email = user.email
    state.info.display_name = user.displayName
    state.info.avatar_url = user.photoURL
    state.info.anonymous = user.isAnonymous
    state.online = true
  },

  logout(state, user) {
    Object.assign(state, UserStateDefault())
  },
}

export const getters: GetterTree<UserState, RootState> = {

  info(state) {
    return state.info
  },

}
