import Vue from 'vue'
import VueI18n from 'vue-i18n'
import dayjs from 'dayjs'
import { Context } from '@nuxt/types'
import { LocaleMessages } from '../../locales'
import { LOCALE_FALLBACK } from '../utils'

export default ({ app, store, route }: Context) => {
  // inject our i18n instance into the app root to be used in middleware
  // construction a new VueI18n

  if (route.query.lang)
    store.commit('switchLocale', route.query.lang)

  Vue.use(VueI18n)

  const locale = store.getters.local

  app.i18n = new VueI18n({
    locale,
    fallbackLocale: LOCALE_FALLBACK,
    messages: LocaleMessages,
    silentFallbackWarn: true,
  })

  // @ts-ignore
  window.onNuxtReady((app: Vue) => {
    store.watch(
      state => state.user_locale,
      (locale) => {
        // Update plugins locale state

        app.$i18n.locale = locale
        app.$vuetify.lang.current = locale
        dayjs.locale(locale)
      },
      { immediate: true },
    )
  })
}
