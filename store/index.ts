import { MutationTree, GetterTree } from 'vuex'
import { RootState } from '~/types/store'
import { Book } from '~/types'

export const state = () => ({
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

export const getters: GetterTree<RootState, RootState> = {

  primary(state, getters) {
    const current: Book | null = getters['book/current']
    let color = 'primary'
    if (current && current.color)
      color = current.color
    return color
  },

}