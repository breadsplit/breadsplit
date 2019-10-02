<template lang='pug'>
section.ma-4
  h1.primary--text Hey, BreadSplit here.
  p.grey--text.text--darken-3 This page is working in progress. You may want to check out our app first 👇

  v-btn.ma-1(:href='socials.app' color='primary' depressed  ) Web App
  v-btn.ma-1(:href='socials.android' color='light-green darken-1' dark depressed)
    v-icon.mr-2 mdi-google-play
    | Google Play
  v-btn.ma-1(:href='socials.dev' color='grey' text) Dev version
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
import socials from '~/../meta/socials'

@Component
export default class extends Vue {
  socials = socials
}
</script>

<style lang='sass' scoped>
h1
  font-size: 3em
p
  font-size: 1.3em
</style>
