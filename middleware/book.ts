
export default function ({ store, route }) {
  if (!store.state.loaded)
    return
  let path = route.fullPath || route.path
  if (path.startsWith('/#'))
    path = path.slice(2)

  const result = /\/book\/(\w*)?/.exec(path)
  if (result && result[1]) {
    const id = result[1]
    return store.commit('book/switchToId', id)
  }
  store.commit('book/switchTo', -1)
}
