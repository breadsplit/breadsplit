import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import { state, mutations, getters } from './store'

Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(Vuetify)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
})

export default (previewComponent) => {
  // https://vuejs.org/v2/guide/render-function.html
  return {
    store,
    render(createElement) {
      return createElement(previewComponent)
    },
  }
}
