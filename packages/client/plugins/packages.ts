import Vue from 'vue'

import VueClipboard from 'vue-clipboard2'

import dayjs from 'dayjs'

import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

Vue.prototype.$dt = dayjs

Vue.use(VueVirtualScroller)
