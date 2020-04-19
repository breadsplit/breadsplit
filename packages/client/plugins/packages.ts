import Vue from 'vue'
import dayjs from 'dayjs'
import VueClipboard from 'vue-clipboard2'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

Vue.prototype.$dt = dayjs

Vue.use(VueVirtualScroller)
Vue.component('Cropper', Cropper)
Vue.component('CircleStencil', CircleStencil)
