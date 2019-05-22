<template lang='pug'>
v-app(:dark='dark')
  app-global-style

  v-content.scrolling.height-100
    nuxt

  app-global-components
</template>

<script lang='ts'>
import { Component, Vue, Getter } from 'nuxt-property-decorator'
import head from './head'

@Component({
  head,
})
export default class BaseLayout extends Vue {
  @Getter('dark') dark!: boolean
}
</script>
