import { CreateVueI18n } from '~/locales'
import Vue from 'vue'

export default ({ app, store }) => {
  // inject our i18n instance into the app root to be used in middleware
  // construction a new VueI18n
  app.i18n = CreateVueI18n(Vue, store.getters.locale)
}
