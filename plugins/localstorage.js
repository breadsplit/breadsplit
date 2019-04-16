
import CreatePersistedState from 'vuex-persistedstate'
import BookRouter from '~/middleware/book'

export default ({ store, isHMR, route }) => {
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
