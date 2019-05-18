<template lang='pug'>
.credit
  .section v{{version}} {{channel}} {{target}}
  br
  .buildinfo
    span Build {{buildtime}} - {{buildTimeFromNow}}
    span(v-if='machine') /{{machine}}
  .section
    span Server: {{serverName}}
  .my-2
  //.line-divider

  //.badge
    v-icon mdi-code-tags
  //template(v-for='(i, idx) in code')
    .divider
    .section
      a(:href='i.href', target='_blank') {{i.name}}

  .newline

  .section
    span Made with
    v-icon.heart(color='#ff4057') mdi-heart
    span in Taiwan
  .copyright
    span Copyright © 2019 The BreadSplit Team
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'

@Component
export default class Credit extends Vue {
  code = []
  design = []
  version = process.env.APP_VERSION
  target = process.env.BUILD_TARGET
  buildtime = process.env.BUILD_TIME
  machine = process.env.BUILD_MACHINE
  channel = process.env.RELEASE_CHANNEL
  serverName = process.env.FIREBASE_SERVER

  get buildTimeFromNow() {
    return dayjs(this.buildtime).fromNow()
  }
}
</script>

<style lang='stylus'>
.credit
  text-align center
  padding-top 30px
  padding-bottom 20px
  opacity 0.7

  .buildinfo
    font-size 0.85em
    opacity 0.5

  .copyright
    font-size 0.85em
    opacity 0.7

  .v-icon
    vertical-align bottom
    margin 0 3px
    font-size 1.5em

  .section, .divider, .badge
    display inline

  .divider:after
    content '•'
    margin 0 7px

  .badge
    font-weight bold

  .newline
    height 4px

  .line-divider
    width 30px
    height 1px
    display inline-block
    background rgb(125,125,125)
    opacity 0.8
    margin 16px

  a
    text-decoration none
    color inherit
    transition 0.5s opacity ease-in-out
    opacity 0.5

    &:not(:last-child)
      margin-right 7px

    &:hover
      opacity 1

</style>
