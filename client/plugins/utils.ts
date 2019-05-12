import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

const PRESS_TIMEOUT = 800

Vue.directive('longpress', {
  bind(el, { value }) {
    if (typeof value !== 'function')
      return

    let pressTimer: NodeJS.Timeout | null = null

    const start = (e) => {
      if (e.type === 'click' && e.button !== 0)
        return

      if (pressTimer === null)
        pressTimer = setTimeout(() => value(e), PRESS_TIMEOUT)
    }

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    ['mousedown', 'touchstart'].forEach(e => el.addEventListener(e, start));

    ['click', 'mouseout', 'touchend', 'touchcancel'].forEach(e => el.addEventListener(e, cancel))
  },
})
