<template lang='pug'>
v-dialog(
  v-model='visible' @keydown.esc='close()'
  v-bind='$attrs'
  :transition='transition'
  :max-width='maxWidth || 600'
  :fullscreen='isFullscreen'
)
  slot(v-if='loaded')
</template>

<script lang='ts'>
import { Component, mixins, Watch, Prop } from 'nuxt-property-decorator'
import { CommonMixin, NavigationMixin } from '~/mixins'

@Component({
  inheritAttrs: false,
  // passing down vars to children
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
export default class Dialog extends mixins(CommonMixin, NavigationMixin) {
  resolve: ((result) => void) | null = null
  reject: ((error) => void) | null = null
  options = {}
  visible = false
  loaded = false

  @Prop({ default: false }) readonly route!: boolean
  @Prop({ default: 'dialog-bottom-transition' }) readonly transition!: boolean
  @Prop() readonly fullscreen: boolean | undefined
  @Prop(Boolean) readonly preload?: boolean
  @Prop({ default: true }) readonly autoReset!: boolean
  @Prop(String) readonly watchOnQuery!: string
  @Prop([String, Number]) readonly maxWidth!: string | number

  get isOpened() {
    return !!this.visible
  }

  @Watch('visible')
  onDialogChanged() {
    if (!this.visible)
      this.close()
  }

  @Watch('$route.path')
  onRouteChanged() {
    if (this.route && this.visible) {
      this.$router.go(1)
      this.close()
    }
  }

  @Watch('$route.query', { deep: true, immediate: true })
  onQueryChanged() {
    if (this.watchOnQuery) {
      if (this.$route.query.dialog === this.watchOnQuery)
        this.open(this.$route.query)

      else if (this.visible)
        this.close()
    }
  }

  get isFullscreen() {
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

  registerListeners() {
    this.children.forEach((c) => {
      // auto listen on child 'close' event
      c.$once('close', () => this.close())
    })
  }

  resetChildren() {
    this.children.forEach((c) => {
      // @ts-ignore
      // eslint-disable-next-line no-prototype-builtins
      if (this.autoReset && c.hasOwnProperty('reset') && c.reset instanceof Function)
      // @ts-ignore
        c.reset()
    })
  }

  open(options = {}) {
    if (!this.loaded)
      this.loaded = true
    this.visible = true
    this.options = options
    this.$nextTick(() => {
      this.registerListeners()
      this.resetChildren()
    })
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  close(flag = true) {
    if (this.resolve) {
      this.resolve(flag)
      this.resolve = null
      this.reject = null
      this.visible = false

      if (this.watchOnQuery && this.$route.query.dialog === this.watchOnQuery)
        this.closeDialog()
    }
    this.visible = false
  }

  mounted() {
    if (this.preload && !this.loaded)
      this.loaded = true
  }
}
</script>
