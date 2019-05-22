import Vue from 'vue'

// Autoload components under "~/components"

// @ts-ignore
const components = require.context('~/components/', true, /(basic|composed|dialogs|global|charts)\/[A-Z]\w+\.(vue)$/)
components.keys().forEach((fileName) => {
  const componentConfig = components(fileName)
  const componentName = fileName.split('/').pop().split('.')[0]
  Vue.component(`App${componentName}`, componentConfig.default || componentConfig)
})
