import Vue from 'vue'
import { MutationTree, GetterTree } from 'vuex'
import { RootState } from '~/types/store'
import { Group } from '~/types'
import { RootStateDefault } from '~/types/defaults'

export const state = RootStateDefault

export const mutations: MutationTree<RootState> = {

  purge(state) {
    const defaults = RootStateDefault()
    for (const key of Object.keys(defaults))
      Vue.set(state, key, defaults[key])
  },

  switchLocale(state, locale: string|null) {
    state.user_locale = locale
  },

  browserLocale(state, locale) {
    state.browser_locale = locale
  },

  loaded(state) {
    state.loaded = true
  },

}

export const getters: GetterTree<RootState, RootState> = {

  locale(state) {
    return state.user_locale || state.browser_locale || 'en'
  },

  primary(state, getters) {
    const current: Group | null = getters['group/current']
    let color = 'primary'
    if (current && current.color)
      color = current.color
    return color
  },

}
