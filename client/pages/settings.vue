<template lang="pug">
app-dialog(ref='settings', fullscreen, hide-overlay, transition='dialog-bottom-transition')
  app-settings(@close='close()')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  mounted() {
    // @ts-ignore
    this.$refs.settings.open()
  }

  close() {
    // @ts-ignore
    this.$refs.settings.close()
    this.$router.go(-1)
  }
}
</script>
