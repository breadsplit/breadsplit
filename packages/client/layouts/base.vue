<template lang='pug'>
v-app(:dark='dark')
  app-global-style
  app-global-components

  v-content.scrolling.height-100
    nuxt
</template>

<script lang='ts'>
import { Component, Vue, Getter, Watch } from 'nuxt-property-decorator'
import head from './head'

@Component({
  head,
})
export default class BaseLayout extends Vue {
  @Getter('dark') dark!: boolean

  @Watch('dark', { immediate: true })
  onThemeChanged() {
    this.$vuetify.theme.dark = this.dark
  }
}
</script>
