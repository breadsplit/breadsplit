<!--
This page will be displayed when the website is open inside a webview.

If you want to test this page on development environment, check this out:
https://www.howtogeek.com/113439/how-to-change-your-browsers-user-agent-without-installing-any-extensions/
-->

<template lang='pug'>
v-container
  img.arrow(src='~/assets/img/top-right-arrow.svg')
  .text
    .header
      span(v-html='$t("tips.click_right_corner_icon_part1",)')
      v-icon(size='24') mdi-dots-vertical
      span(v-html='$t("tips.click_right_corner_icon_part2",)')

    .subheader(v-html='$t("tips.select_open_in_browser")')

  // TODO:WRITING: more details instructions
  // TODO:CODE: add "continue anyway" button
</template>

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
