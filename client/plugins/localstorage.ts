
import CreatePersistedState from 'vuex-persistedstate'
import { Context } from '@nuxt/vue-app'

const StoreKey = 'breadsplit-store'
const PathsEnabled = [
  'user_locale',
  'group',
  'user.me',
  'user.users',
  'options',
]

export default ({ store }: Context) => {
  CreatePersistedState({
    key: StoreKey,
    paths: PathsEnabled,
  })(store)
  window.addEventListener('storage', (e) => {
    if (e.key !== StoreKey)
      return
    if (!e.newValue)
      return
    const data = JSON.parse(e.newValue)
    store.commit('localstorageLoad', data)
  })
}
