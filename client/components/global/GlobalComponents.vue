<template lang='pug'>
div
  app-confirm(ref='confirm')
  app-prompt(ref='prompt')
  app-loading-dialog(ref='loading')
  app-snackbar(ref='snack')
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
import Snackbar from './Snackbar.vue'
import Confirm from './Confirm.vue'
import Prompt from './Prompt.vue'
import LoadingDialog from './LoadingDialog.vue'

@Component
export default class GlobalComponents extends Vue {
  $refs!: {
    snack: Snackbar
    confirm: Confirm
    prompt: Prompt
    loading: LoadingDialog
  }

  mounted() {
    Vue.prototype.$snack = this.$refs.snack.open
    Vue.prototype.$confirm = this.$refs.confirm.open
    Vue.prototype.$prompt = this.$refs.prompt.open
    Vue.prototype.$apploading = this.$refs.loading
  }
}
</script>
