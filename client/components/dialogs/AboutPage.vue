<template lang='pug'>
v-card.about-page
  app-dialog-bar(@close='close()' attached absolute height='30px')

  v-container.text-xs-center.pt-0
    app-logo-name.large

    .pa-2

    p Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    p Nulla facilisi cras fermentum odio eu. Vestibulum mattis ullamcorper velit sed ullamcorper. Pretium fusce id velit ut tortor. Cursus in hac habitasse platea dictumst quisque. Augue mauris augue neque gravida in fermentum et sollicitudin ac. Nunc vel risus commodo viverra maecenas accumsan lacus.

    .pa-2

    .support-us {{$t('ui.support_us')}}

    app-brand-button(brand='paypal' :href='socials.paypal' target='__blank')
      span {{$t('ui.donate_on_paypal')}}
    br
    app-brand-button(brand='patreon' :href='socials.patreon' target='__blank')
      span {{$t('ui.become_a_patreon')}}
    br
    app-brand-button(brand='github_dark' :href='socials.github' target='__blank')
      span {{$t('ui.star_on_github')}}

    app-credit
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import socials from '~/../meta/socials'
import { DialogChildMixin } from '~/mixins'

@Component
export default class AboutPage extends mixins(DialogChildMixin) {
  socials = socials
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
