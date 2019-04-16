export const state = () => ({
  locale: 'en',
  loaded: false,
})

export const mutations = {
  switchLocale(state, locale) {
    state.locale = locale
  },
  loaded(state) {
    state.loaded = true
  },
}
