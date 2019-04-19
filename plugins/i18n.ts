import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { AcceptLanguage, Config } from '~/locales'

Vue.use(VueI18n)

export default ({ app, store }) => {
  // inject our i18n instance into the app root to be used in middleware
  // we assume a store/index.js file has been defined and the variable 'locale' defined on store, we'll go into this in detail in the next code snippet
  // construction a new VueI18n
  app.i18n = new VueI18n({
    locale: store.state.locale,
    messages: Config.messages,
    fallbackLocale: Config.fallbackLocale,
    silentFallbackWarn: true,
  })

  if (process.client) {
    // @ts-ignore
    window.onNuxtReady(() => {
      // @ts-ignore
      const language = window.navigator.language || window.navigator.userLanguage || ''
      const browser_locale = AcceptLanguage(language)

      // console.log(language, browser_locale)
      app.i18n.locale = store.state.locale || browser_locale

      store.commit('switchLocale', app.i18n.locale)
    })
  }
}
