<template lang='pug'>
v-card.about-page
  app-dialog-bar(@close='close()')
    | {{$t('ui.about')}}

  v-container.text-xs-center.pt-0
    app-logo-name.large

    .pa-2

    p Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    p Nulla facilisi cras fermentum odio eu. Vestibulum mattis ullamcorper velit sed ullamcorper. Pretium fusce id velit ut tortor. Cursus in hac habitasse platea dictumst quisque. Augue mauris augue neque gravida in fermentum et sollicitudin ac. Nunc vel risus commodo viverra maecenas accumsan lacus.

    .pa-2

    .support-us {{$t('ui.support_us')}}

    app-brand-button(brand='patreon' :href='socials.patreon' target='__blank')
      span {{$t('ui.become_a_patreon')}}
    br
    app-brand-button(brand='github_dark' :href='socials.github' target='__blank')
      span Github

    app-credit
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import socials from '~/meta/socials'

@Component
export default class AboutPage extends Vue {
  socials = socials

  close(result?) {
    this.$emit('close', result)
  }
}
</script>

<style lang='stylus' scoped>
.about-page
  p
    text-align left
    padding 0 2em
  .support-us
    font-size 1.1em
    font-weight bold
</style>
