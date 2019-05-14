
import CreatePersistedState from 'vuex-persistedstate'
import GroupRouter from '~/middleware/group'

const StoreKey = 'breadsplit-store'
const PathsEnabled = [
  'user_locale',
  'group',
  'user.me',
  'user.users',
  'options',
]

export default ({ store, route, app }) => {
  CreatePersistedState({
    key: StoreKey,
    paths: PathsEnabled,
  })(store)
  GroupRouter({ store, route })
  window.addEventListener('storage', (e) => {
    if (e.key !== StoreKey)
      return
    if (!e.newValue)
      return
    const data = JSON.parse(e.newValue)
    store.commit('localstorageLoad', data)
  })
}
