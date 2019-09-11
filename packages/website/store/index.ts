import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '../types'
import { acceptLanguage } from '../utils'

export const state = () => ({
  user_locale: null,
  browser_locale: acceptLanguage(),
})

export const mutations: MutationTree<RootState> = {
  switchLocale (state, locale: string | null) {
    state.user_locale = locale
  },

  browserLocale (state, locale) {
    state.browser_locale = locale
  },
}

export const actions: ActionTree<RootState, RootState> = {
}
