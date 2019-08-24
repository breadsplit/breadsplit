
import queryString from 'query-string'
import Vue from 'vue'

let lockA = false
let lockB = false

export const hash = new Vue({
  data: {
    value: {},
  },
})

window.addEventListener('hashchange', () => {
  if (lockB)
    return
  const object = queryString.parse(location.hash, { parseBooleans: true, parseNumbers: true, arrayFormat: 'comma' })
  lockA = true
  for (const [key, value] of Object.entries(object))
    Vue.set(hash.value, key, value)
  lockA = false
}, false)

hash.$watch('value', () => {
  if (lockA)
    return
  lockB = true
  location.hash = queryString.stringify(hash.value, { arrayFormat: 'comma' })
  lockB = false
})
