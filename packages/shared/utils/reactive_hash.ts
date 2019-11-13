
import queryString from 'query-string'
import Vue from 'vue'

let lock = false

function stringify (value: any) {
  return queryString.stringify(value, { arrayFormat: 'comma' })
}

export const reactiveHash = new Vue({
  data: {
    value: {},
  },
  methods: {
    updateField (field: string, value: any, updateHistory = false) {
      this.$set(this.value, field, value)
      this.update(this.value, updateHistory)
    },
    update (value: any, updateHistory = false) {
      if (lock)
        return
      lock = true
      Vue.set(this, 'value', value)
      const hash = stringify(value)
      if (updateHistory) {
        // @ts-ignore
        history.pushState(undefined, undefined, `#${hash}`)
      }
      else {
        // @ts-ignore
        history.replaceState(undefined, undefined, `#${hash}`)
      }
      lock = false
    },
  },
})

function read () {
  if (lock)
    return
  const object = queryString.parse(location.hash, { parseBooleans: true, parseNumbers: true, arrayFormat: 'comma' })
  lock = true
  for (const [key, value] of Object.entries(object))
    Vue.set(reactiveHash.value, key, value)
  lock = false
}

window.addEventListener('hashchange', read, false)
read()
