import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { Context } from '@nuxt/vue-app'
import { LOCALE_FALLBACK } from '../../utils/i18n'
import { Messages } from '~/locales'

export default ({ app, store, route }: Context) => {
  // inject our i18n instance into the app root to be used in middleware
  // construction a new VueI18n

  if (route.query.lang)
    store.commit('switchLocale', route.query.lang)

  Vue.use(VueI18n)

  app.i18n = new VueI18n({
    locale: store.getters.locale,
    fallbackLocale: LOCALE_FALLBACK,
    messages: Messages,
    silentFallbackWarn: true,
  })
}
