
import CreatePersistedState from 'vuex-persistedstate'
import BookRouter from '~/middleware/book'
import { acceptLanguages } from '@/locales'

export default ({ store, route, app }) => {
  window.onNuxtReady(() => {
    CreatePersistedState({
      key: 'moneyflow-store',
      paths: [
        'locale',
        'user',
        'book',
      ],
    })(store)
    store.commit('loaded')
    const language = window.navigator.language || window.navigator.userLanguage || ''
    const browser_locale = acceptLanguages(language)
    // console.log(language, browser_locale)
    app.i18n.locale = store.state.locale || browser_locale
    store.commit('loaded')
    BookRouter({ store, route })
  })
}
