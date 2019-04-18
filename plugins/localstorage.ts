
import CreatePersistedState from 'vuex-persistedstate'
import BookRouter from '~/middleware/book'

export default ({ store, route, app }) => {
  // @ts-ignore
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
    BookRouter({ store, route })
  })
}
