import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import { state, mutations, getters } from './store'
import { Messages } from './locales'
import theme from '~/../meta/theme'
import 'vuetify/dist/vuetify.min.css'
import './assets/style/app.styl'

Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(Vuetify, {
  theme,
  iconfont: 'mdi',
})

const store = new Vuex.Store({
  state,
  getters,
  mutations,
})

const i18n = new VueI18n({
  locale: store.getters.locale,
  fallbackLocale: 'en',
  messages: Messages,
  silentFallbackWarn: true,
})

export default (previewComponent) => {
  // https://vuejs.org/v2/guide/render-function.html
  return {
    store,
    i18n,
    render(createElement) {
      return createElement(previewComponent)
    },
  }
}
