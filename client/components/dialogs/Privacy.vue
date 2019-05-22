<template lang='pug'>
v-card.privacy-page
  .iframe-wrapper
    iframe(ref='iframe' :src='socials.privacy', :class='{mobile: isMobile}')
  app-close-button(@close='close')
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import socials from '~/../meta/socials'
import { DialogChildMixin, CommonMixin } from '~/mixins'

@Component
export default class PrivacyPage extends mixins(CommonMixin, DialogChildMixin) {
  socials = socials
}
</script>

<style lang='stylus' scoped>
.privacy-page
  overflow hidden
  height 100%

  .iframe-wrapper
    overflow auto
    -webkit-overflow-scrolling touch

  iframe
    width 100%
    min-height 600px
    height 100%
    border none
    &.mobile
      height 100vh

</style>
