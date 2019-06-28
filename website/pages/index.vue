<template lang='pug'>
section.ma-4
  h1.primary--text Hey, BreadSplit here.
  p.grey--text.text--darken-3 This page is working in progress. You may want to check out our app first 👇

  v-btn(:href='socials.app' color='primary') Go to app
  v-btn(:href='socials.dev' color='grey' text) Dev version
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
import socials from '~/../meta/socials'

@Component
export default class extends Vue {
  socials = socials
}
</script>

<style lang='stylus' scoped>
h1
  font-size 3em
p
  font-size 1.3em
</style>
