<template lang='pug'>
.credit

  .section v{{version}}

  br
  .line-divider
  br

  //.badge
    v-icon mdi-code-tags
  template(v-for='(i, idx) in code')
    .divider
    .section
      a(:href='i.href', target='_blank') {{i.name}}
  .newline

  .section
    span Made with
    v-icon.heart(color='#ff4057') mdi-heart
    span in Taiwan

</template>

<script>
import version from '~/version'

export default {
  data() {
    return {
      version,
      code: [],
      design: [],
    }
  },
}
</script>

<style lang='stylus'>
.credit
  color rgba(0,0,0,0.6)
  text-align center
  padding 100px 0

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
    background black
    opacity 0.1
    margin 16px

  a
    text-decoration none
    color inherit
    transition 0.5s opacity ease-in-out

    &:not(:last-child)
      margin-right 7px

    &:hover
      color rgba(0,0,0,1)

</style>
