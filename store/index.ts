import { MutationTree } from 'vuex'
import { RootState } from '~/types/store'

export const state = (): RootState => ({
  locale: '',
  loaded: false,
})

export const mutations: MutationTree<RootState> = {

  switchLocale(state, locale:string) {
    state.locale = locale
  },

  loaded(state) {
    state.loaded = true
  },

}
