<template lang='pug'>
v-dialog(
  v-model='visible', @keydown.esc='cancel'
  v-bind='$attrs', style='z-index:200',
  :transition='transition', :max-width='600'
  :fullscreen='getfullscreen'
)
  slot(v-if='!lazy || visible')
</template>

<script lang='ts'>
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator'
import CommonMixin from '~/mixins/common'

@Component({
  inheritAttrs: false,
  provide() {
    const dialog = {}
    Object.defineProperty(dialog, 'options', {
      enumerable: true,
      // @ts-ignore
      get: () => this.options,
    })
    Object.defineProperty(dialog, 'visible', {
      enumerable: true,
      // @ts-ignore
      get: () => this.visible,
    })
    return { dialog }
  },
})
export default class Dialog extends Mixins(CommonMixin) {
  resolve: ((result) => void) | null = null
  reject: ((error) => void) | null = null

  @Prop({ default: false }) readonly route!: boolean
  @Prop({ default: 'dialog-bottom-transition' }) readonly transition!: boolean
  @Prop() readonly fullscreen: boolean | undefined
  @Prop({ default: true }) readonly lazy!: boolean
  @Prop({ default: true }) readonly reset!: boolean

  options = {}
  visible = false

  get isOpened() {
    return !!this.visible
  }

  @Watch('dialog')
  onDialogChanged() {
    if (!this.visible)
      this.$emit('exit')
  }

  @Watch('$route.path')
  onRouteChanged() {
    if (this.route && this.visible) {
      this.$router.go(1)
      this.close()
    }
  }

  get getfullscreen() {
    if (this.fullscreen != null)
      return this.fullscreen
    return this.isMobile
  }

  get children() {
    try {
      // this first level child is v-dialog and second is v-theme-provider
      // the third level will be the real slot instances
      return this.$children[0].$children[0].$children
    }
    catch {
      return []
    }
  }

  open(options = {}) {
    this.visible = true
    this.options = options
    this.$nextTick(() => {
      this.children.forEach((c) => {
        // auto listen on child 'close' event
        c.$once('close', () => this.close())

        // @ts-ignore
        if (this.reset && c.hasOwnProperty('reset') && c.reset instanceof Function)
        // @ts-ignore
          c.reset()
      })
    })
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  close(flag = true) {
    if (this.resolve)
      this.resolve(flag)
    if (this.visible)
      this.visible = false
  }
}
</script>
