<template lang='pug'>
div
  app-confirm(ref='confirm')
  app-prompt(ref='prompt')
  app-loading-dialog(ref='loading')
  app-snackbar(ref='snack')
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class GlobalStyle extends Vue {
  mounted() {
    // @ts-ignore
    this.$root.$snack = this.$refs.snack.open
    // @ts-ignore
    this.$root.$confirm = this.$refs.confirm.open
    // @ts-ignore
    this.$root.$prompt = this.$refs.prompt.open
    // @ts-ignore
    this.$root.$apploading = this.$refs.loading
  }
}
</script>
