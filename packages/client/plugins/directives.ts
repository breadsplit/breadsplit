import Vue from 'vue'

const PRESS_TIMEOUT = 600
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

    ['mousedown', 'touchstart'].forEach(e => el.addEventListener(e, start, { passive: true }));

    ['click', 'mouseout', 'touchend', 'touchcancel'].forEach(e => el.addEventListener(e, cancel, { passive: true }))
  },
})

Vue.directive('columns', (el, binding) => {
  el.style.display = 'grid'
  el.style.gridTemplateColumns = binding.value
})

Vue.directive('rows', (el, binding) => {
  el.style.display = 'grid'
  el.style.gridTemplateRows = binding.value
})
