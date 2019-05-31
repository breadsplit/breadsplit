<template lang='pug'>
div
  app-confirm(ref='confirm')
  app-prompt(ref='prompt')
  app-loading-dialog(ref='loading')
  app-snackbar(ref='snack')
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class GlobalComponents extends Vue {
  mounted() {
    // @ts-ignore
    Vue.prototype.$snack = this.$refs.snack.open
    // @ts-ignore
    Vue.prototype.$confirm = this.$refs.confirm.open
    // @ts-ignore
    Vue.prototype.$prompt = this.$refs.prompt.open
    // @ts-ignore
    Vue.prototype.$apploading = this.$refs.loading
  }
}
</script>
