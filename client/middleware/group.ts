
export default function ({ store, route }) {
  if (!store.state.loaded)
    return
  let path = route.fullPath || route.path
  if (path.startsWith('/#'))
    path = path.slice(2)

  const result = /\/group\/([\w:-]*)?/.exec(path)
  if (result && result[1]) {
    const id = result[1]
    return store.commit('group/switch', id)
  }
  store.commit('group/switch', null)
}
