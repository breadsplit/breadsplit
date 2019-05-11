import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { Messages } from '~/locales'

export default ({ app, store }) => {
  // inject our i18n instance into the app root to be used in middleware
  // construction a new VueI18n

  Vue.use(VueI18n)

  app.i18n = new VueI18n({
    locale: store.getters.locale,
    fallbackLocale: 'en',
    messages: Messages,
    silentFallbackWarn: true,
  })
}
