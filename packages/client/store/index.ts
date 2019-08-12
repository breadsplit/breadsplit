import Vue from 'vue'
import { MutationTree, GetterTree } from 'vuex'
import { LOCALE_FALLBACK } from '../../utils/i18n'
import { RootStateDefault } from './_defaults'
import { RootState, Group } from '~/types'
import { APP_VERSION } from '~/../meta/env'
export * from './_defaults'

export const state = RootStateDefault

export const getters: GetterTree<RootState, RootState> = {

  locale (state) {
    return state.user_locale || state.browser_locale || LOCALE_FALLBACK
  },

  dark (state) {
    return state.options.dark
  },

  primary (state, getters) {
    const current: Group | null = getters['group/current']
    let color = 'primary'
    if (current && current.color)
      color = current.color
    return color
  },
}

export const mutations: MutationTree<RootState> = {

  purge (state) {
    const defaults = RootStateDefault()
    for (const key of Object.keys(defaults))
      Vue.set(state, key, defaults[key])
  },

  switchLocale (state, locale: string | null) {
    state.user_locale = locale
  },

  browserLocale (state, locale) {
    state.browser_locale = locale
  },

  dark (state, value) {
    state.options.dark = !!value
  },

  setMessagingToken (state, value) {
    state.messaging_token = value
  },

  localstorageLoad (state, data: RootState) {
    const group = data.group
    delete data.group
    Object.assign(state, data)

    // do not update currentGroups from other tabs
    delete group.currentId
    Object.assign(state.group, group)
  },

  init (state) {
    state.app = {
      init: true,
      version: APP_VERSION,
    }
  },
}
