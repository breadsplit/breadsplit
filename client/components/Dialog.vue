<template lang='pug'>
v-dialog(
  v-model='dialog', @keydown.esc='cancel'
  v-bind='$attrs', style='z-index:200'
)
  slot(v-if='dialog')
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class Dialog extends Vue {
  dialog= false
  resolve= null
  reject= null
  options= {}

  get isOpened() {
    return !!this.dialog
  }

  @Watch('dialog')
  onDialogChanged() {
    if (!this.dialog)
      this.$emit('exit')
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
    this.resolve(flag)
    if (this.dialog)
      this.dialog = false
  }
}
</script>
