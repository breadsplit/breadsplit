<template lang='pug'>
v-card.about-page
  app-dialog-bar(@close='close()')
    | {{$t('ui.about')}}

  v-container.text-xs-center
    img(src='/favicon-194x194.png', height='100px')
    .appname {{$t('appname')}}
    p balabalbala

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
.appname
  font-size 2em
  font-weight bold
</style>
