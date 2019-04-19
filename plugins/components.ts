import Vue from 'vue'
import Confirm from '~/components/Confirm.vue'

// Auto load components in the '/components' dir
// @ts-ignore
const components = require.context('@/components', false, /[A-Z]\w+\.(vue)$/)
components.keys().forEach((fileName) => {
  const componentConfig = components(fileName)
  const componentName = fileName.split('/').pop().split('.')[0]
  Vue.component(`App${componentName}`, componentConfig.default || componentConfig)
})

// Register confirm dialog globally
Vue.use(() => {
  function createDialogCmp(options) {
    return new Promise((resolve) => {
      const cmp = new Vue(Object.assign({}, Confirm, {
        propsData: Object.assign({}, options),
        destroyed: (c) => {
          document.body.removeChild(cmp.$el)
          // @ts-ignore
          resolve(cmp.value)
        },
      }))
      document.body.appendChild(cmp.$mount().$el)
    })
  }

  function show(message, options: { message?: string } = {}) {
    options.message = message
    return createDialogCmp(options)
  }

  Vue.prototype.$confirm = show
})
