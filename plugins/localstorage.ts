
import CreatePersistedState from 'vuex-persistedstate'
import GroupRouter from '~/middleware/group'

export default ({ store, route, app }) => {
  // @ts-ignore
  window.onNuxtReady(() => {
    CreatePersistedState({
      key: 'moneyflow-store',
      paths: [
        'locale',
        'group',
      ],
    })(store)
    store.commit('loaded')
    GroupRouter({ store, route })
  })
}
