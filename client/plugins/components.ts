import Vue from 'vue'

// Auto load components in the '/components' dir
// @ts-ignore
const components = require.context('@/components', false, /[A-Z]\w+\.(vue)$/)
components.keys().forEach((fileName) => {
  const componentConfig = components(fileName)
  const componentName = fileName.split('/').pop().split('.')[0]
  Vue.component(`App${componentName}`, componentConfig.default || componentConfig)
})
