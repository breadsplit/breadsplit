import { Context } from '@nuxt/types'

export default function ({ store, route }: Context) {
  const result = /\/group\/([\w:-]*)?/.exec(route.path)
  if (result && result[1]) {
    const id = result[1]
    return store.commit('group/switch', id)
  }
  store.commit('group/switch', null)
}
