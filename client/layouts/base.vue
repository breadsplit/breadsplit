<template lang='pug'>
v-app(:dark='dark')
  app-global-style

  nuxt
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component
export default class BaseLayout extends Vue {
  @Getter('dark') dark!: boolean
}
</script>
