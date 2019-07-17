import { MutationTree, GetterTree } from 'vuex'
import { RootState, CacheState } from '~/types/store'
import { CacheStateDefault } from '~/store'

export const state = CacheStateDefault

export const mutations: MutationTree<CacheState> = {
  save (state, { type, key, data }) {
    state[type][key] = data
  },
}

export const getters: GetterTree<CacheState, RootState> = {

}
