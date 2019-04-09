export const state = () => ({
  locale: 'en',
})

export const mutations = {
  switchLocale(state, locale) {
    state.locale = locale
  },
}
