import Vue from 'vue'
import { MutationTree, GetterTree } from 'vuex'
import { RootState } from '~/types/store'
import { Group } from '~/types/models'
import { RootStateDefault } from '~/utils/defaults'

export const state = RootStateDefault

export const getters: GetterTree<RootState, RootState> = {

  locale(state) {
    return state.user_locale || state.browser_locale || 'en'
  },

  dark(state) {
    return state.options.dark
  },

  primary(state, getters) {
    const current: Group | null = getters['group/current']
    let color = 'primary'
    if (current && current.color)
      color = current.color
    return color
  },

}

export const mutations: MutationTree<RootState> = {

  purge(state) {
    const defaults = RootStateDefault()
    for (const key of Object.keys(defaults))
      Vue.set(state, key, defaults[key])
  },

  switchLocale(state, locale: string | null) {
    state.user_locale = locale
  },

  browserLocale(state, locale) {
    state.browser_locale = locale
  },

  loaded(state) {
    state.loaded = true
  },

  dark(state, value) {
    state.options.dark = !!value
  },

  setMessagingToken(state, value) {
    state.messaging_token = value
  },
}
