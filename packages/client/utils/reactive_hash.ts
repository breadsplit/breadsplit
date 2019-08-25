
import queryString from 'query-string'
import Vue from 'vue'

let lock = false

export const hash = new Vue({
  data: {
    value: {},
  },
  watch: {
    value: {
      deep: true,
      handler () {
        if (lock)
          return
        lock = true
        location.hash = queryString.stringify(hash.value, { arrayFormat: 'comma' })
        lock = false
      },
    },
  },
})

function read () {
  if (lock)
    return
  const object = queryString.parse(location.hash, { parseBooleans: true, parseNumbers: true, arrayFormat: 'comma' })
  lock = true
  for (const [key, value] of Object.entries(object))
    Vue.set(hash.value, key, value)
  lock = false
}

window.addEventListener('hashchange', read, false)
read()
