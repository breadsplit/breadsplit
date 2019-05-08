import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import VueImgFallback from 'v-img-fallback'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(VueImgFallback, {
  loading: require('~/assets/img/loading.svg'),
})
