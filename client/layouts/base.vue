<template lang='pug'>
v-app(:dark='dark')
  app-global-style

  v-content
    nuxt

  app-snackbar(ref='snack')
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component
export default class BaseLayout extends Vue {
  @Getter('dark') dark!: boolean

  mounted() {
    // @ts-ignore
    this.$root.$snack = this.$refs.snack.open
  }
}
</script>
