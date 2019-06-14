import CreatePersistedState from 'vuex-persistedstate'
import { Context } from '@nuxt/vue-app'

const StoreKey = 'breadsplit-store'
const PathsEnabled = [
  'user_locale',
  'group',
  'user.me',
  'user.users',
  'options',
  'app',
  'cache',
]

export default ({ store }: Context) => {
  CreatePersistedState({
    key: StoreKey,
    paths: PathsEnabled,
    filter: (mutation) => {
      if (mutation.type === 'group/switch')
        return false
      // do not write changes updated by other tabs
      if (mutation.type === 'localstorageLoad')
        return false
      return true
    },
  })(store)
  store.dispatch('group/cacheInit')
  window.addEventListener('storage', (e) => {
    if (e.key !== StoreKey)
      return
    if (!e.newValue)
      return
    const data = JSON.parse(e.newValue)
    store.commit('localstorageLoad', data)
  })
}
