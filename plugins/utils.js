import Vue from 'vue'
import chroma from 'chroma-js'

Vue.use(() => {
  Vue.prototype.$utils = {
    isDark(color) {
      return chroma(color).luminance() < 0.5
    },
  }
})
