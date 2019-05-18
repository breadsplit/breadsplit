<template lang='pug'>
.logo-name
  img.logo(src='/img/png/favicon-194x194.png')
  .app-name(:style='{color:$vuetify.theme.primary}') {{$t('appname')}}
  .channel(v-text='channel')
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class DefaultLayout extends Vue {
  channel: string = process.env.RELEASE_CHANNEL || ''
}
</script>

<style lang='stylus'>
.logo-name
  padding 12px
  text-align center

  .logo
    height 40px

  .logo, .app-name
    display inline-block
    vertical-align middle

  .app-name
    font-size 1.3em
    line-height 1em
    font-weight bold
    padding 0.3em 0.2em 0 0.3em

  .channel
    display inline-block
    font-size 0.7em
    color rgba(125,125,125, 0.3)
    font-weight normal
    text-transform uppercase

  &.clickable
    cursor pointer

  &.large
    font-size 2em
    .app-name
      font-weight normal

    .logo
      height 80px

</style>
