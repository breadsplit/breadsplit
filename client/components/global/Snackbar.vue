<template lang='pug'>
v-snackbar(
  v-model='show',
  v-bind='$attrs',
  :timeout='options.timeout',
  :right='!isMobile'
  :top='!isMobile'
  :bottom='isMobile'
  :color='options.color'
)
  span(v-html='message')
  template(v-for='button in options.buttons')
    v-btn(:color='options.buttonColor', text, @click='button.handler') {{button.text}}
</template>

<script lang='ts'>
import { Component, mixins, Vue } from 'nuxt-property-decorator'
import CommonMixin from '~/mixins/common'
import { SnackOptions } from '~/types'

@Component({
  inheritAttrs: false,
})
export default class Snackbar extends mixins(CommonMixin) {
  show = false
  resolve: ((result?) => void) | null = null
  reject: ((error) => void) | null = null
  message = ''
  options = this.defaultOption

  get defaultOption(): SnackOptions {
    return {
      color: '',
      buttonColor: 'primary',
      timeout: 3000,
      buttons: [],
    }
  }

  open(message: string, options?: SnackOptions) {
    const open = () => {
      this.message = message
      this.options = Object.assign({}, this.defaultOption, options)
      this.show = true
    }

    // if already opened, reset and open again
    if (this.show) {
      this.show = false
      Vue.nextTick(open)
      return
    }

    // not opened
    open()
  }
}
</script>
