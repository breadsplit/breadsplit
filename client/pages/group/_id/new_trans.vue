<template lang='pug'>
app-dialog(
  ref='dialog' :fullscreen='isMobile' max-width='800'
  transition='dialog-bottom-transition' persistent no-click-animation
  @exit='$router.go(-1)')
  app-new-transaction(v-bind='options', @close='close()')
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import CommonMixin from '~/mixins/common'

@Component
export default class NewTransactionPage extends Mixins(CommonMixin) {
  get options() {
    return this.$route.query || {}
  }

  mounted() {
    // @ts-ignore
    this.$refs.dialog.open()
  }

  beforeDestory() {
    // @ts-ignore
    this.$refs.dialog.close()
  }

  close() {
    // @ts-ignore
    this.$refs.dialog.close()
  }
}
</script>
