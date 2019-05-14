<!--
This page will be displayed when the website is open inside a webview.

If you want to test this page on development environment, check this out:
https://www.howtogeek.com/113439/how-to-change-your-browsers-user-agent-without-installing-any-extensions/
-->
<template lang='pug'>
v-container
  img.arrow(src='/img/svg/top-right-arrow.svg')
  .text
    .header
      span(v-html='$t("tips.click_right_corner_icon_part1",)')
      v-icon(size='24') mdi-dots-vertical
      span(v-html='$t("tips.click_right_corner_icon_part2",)')

    .subheader(v-html='$t("tips.select_open_in_browser")')

  .text-xs-center(style='margin-top: 150px')
    v-btn(color='primary', flat, @click='ingore()') Continue anyway

  // TODO:WRITING: more details instructions
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'base',
})
export default class WebviewBlocked extends Vue {
  ingore() {
    const path = this.$route.fullPath.slice(2)
    const queryString = path.slice(path.indexOf('?') || 0)
    const query = new URLSearchParams(queryString)
    this.$router.replace(`${query.get('from') || '/'}`)
  }
}
</script>

<style lang="stylus" scoped>
.header
  font-size 1.5em
  & > *
    vertical-align middle

.subheader
  font-size 1.1em

.arrow
  position absolute
  top 10px
  right 10px
  width 80px

.text
  position absolute
  text-align right
  top 40px
  right 100px
</style>
