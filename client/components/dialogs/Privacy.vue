<template lang='pug'>
v-card.privacy-page
  iframe(ref='iframe' :src='socials.privacy', :class='{mobile: isMobile}')
  v-btn.close-button(icon @click='close(false)', color='white')
    v-icon(color='primary') mdi-close
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import socials from '~/meta/socials'
import { DialogChildMixin, CommonMixin } from '~/mixins'

@Component
export default class PrivacyPage extends Mixins(CommonMixin, DialogChildMixin) {
  socials = socials
}
</script>

<style lang='stylus' scoped>
.privacy-page
  overflow hidden
  height 100%

  iframe
    width 100%
    min-height 600px
    height 100%
    border none
    &.mobile
      height 100vh

  .close-button
    position absolute
    top 12px
    right 12px
    z-index 10
</style>
