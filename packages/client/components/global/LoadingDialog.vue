<template lang='pug'>
v-dialog(v-model='show', persistent, width='300', v-bind='$attrs')
  v-card(color='primary', dark)
    v-card-text
      span {{text}}
      v-progress-linear.mb-0(indeterminate, color='white')
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class LoadingDialog extends Vue {
  text = ''
  show = false

  open(text) {
    this.text = text
    this.show = true
  }

  close() {
    this.show = false
    this.text = ''
  }
}
</script>
