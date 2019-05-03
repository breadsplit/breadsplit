
import CreatePersistedState from 'vuex-persistedstate'
import GroupRouter from '~/middleware/group'

const StoreKey = 'splitoast-store'
const PathsEnabled = [
  'user_locale',
  'group',
  'user.me',
  'user.users',
  'dark',
]

export default ({ store, route, app }) => {
  CreatePersistedState({
    key: StoreKey,
    paths: PathsEnabled,
  })(store)
  store.commit('loaded')
  GroupRouter({ store, route })
}
