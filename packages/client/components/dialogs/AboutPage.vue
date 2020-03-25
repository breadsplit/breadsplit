<template lang='pug'>
v-card.about-page
  app-dialog-bar(@close='close()' attached absolute height='30px')

  v-container.text-center(:class='{"pt-0": isMobile, "pt-4": !isMobile}')
    app-logo-name.large

    .pa-2

    p Group bills split made easy, fast and customizable.

    p Always free and open source.

    .pa-2

    .support-us {{$t('ui.support_us')}}

    app-brand-button.my-1(brand='paypal' :href='socials.paypal' target='__blank')
      span {{$t('ui.donate_on_paypal')}}
    br
    app-brand-button.my-1(brand='patreon' :href='socials.patreon' target='__blank')
      span {{$t('ui.become_a_patreon')}}
    br
    app-brand-button.my-1(brand='github_dark' :href='socials.github' target='__blank')
      span {{$t('ui.star_on_github')}}

    app-credit
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import socials from '~/../meta/socials'
import { DialogChildMixin, CommonMixin } from '~/mixins'

@Component
export default class AboutPage extends mixins(DialogChildMixin, CommonMixin) {
  socials = socials
}
</script>

<style lang='sass' scoped>
.about-page
  font-size: 0.95em

  p
    text-align: left
    padding: 0 2em
  .support-us
    font-size: 1.1em
    font-weight: bold
</style>
