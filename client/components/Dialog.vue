<template lang='pug'>
v-dialog(
  v-model='dialog', @keydown.esc='cancel'
  v-bind='$attrs', style='z-index:200',
  :transition='transition', :max-width='800'
  :fullscreen='getfullscreen'
)
  slot(v-if='dialog')
</template>

<script lang='ts'>
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator'
import CommonMixin from '~/mixins/common'

@Component({
  inheritAttrs: false,
})
export default class Dialog extends Mixins(CommonMixin) {
  dialog = false
  resolve: ((result) => void) | null = null
  reject: ((error) => void) | null = null
  options = {}

  @Prop({ default: false }) readonly route!: boolean
  @Prop({ default: 'dialog-bottom-transition' }) readonly transition!: boolean
  @Prop(Boolean) readonly fullscreen: boolean | undefined

  get isOpened() {
    return !!this.dialog
  }

  @Watch('dialog')
  onDialogChanged() {
    if (!this.dialog)
      this.$emit('exit')
  }

  @Watch('$route.path')
  onRouteChanged() {
    if (this.route && this.dialog) {
      this.$router.go(1)
      this.close()
    }
  }

  get getfullscreen() {
    if (this.fullscreen !== null)
      return this.fullscreen
    return this.isMobile()
  }

  open(options = {}) {
    this.dialog = true
    this.options = options
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  close(flag = true) {
    if (this.resolve)
      this.resolve(flag)
    if (this.dialog)
      this.dialog = false
  }
}
</script>
