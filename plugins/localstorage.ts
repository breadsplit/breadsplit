
import CreatePersistedState from 'vuex-persistedstate'
import GroupRouter from '~/middleware/group'

const StoreKey = 'splittable-store'
const PathsEnabled = [
  'user_locale',
  'group',
]

export default ({ store, route, app }) => {
  // @ts-ignore
  window.onNuxtReady(() => {
    CreatePersistedState({
      key: StoreKey,
      paths: PathsEnabled,
    })(store)
    store.commit('loaded')
    app.i18n.locale = store.getters.locale
    GroupRouter({ store, route })
  })
}
