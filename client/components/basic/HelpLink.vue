<template lang='pug'>
.help-link(@click='onClick()')
  v-icon.icon(size='20') mdi-help-circle-outline
  .text
    slot {{$t(`help.${help}.tips`)}}

  v-dialog(v-model='dialog', width='350px')
    app-help-dialog(:help='help', @close='dialog = false')
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class HelpLink extends Vue {
  dialog = false

  @Prop({ default: true }) readonly icon!: boolean
  @Prop(String) readonly help?: string

  onClick() {
    this.dialog = true
  }
}
</script>

<style lang='stylus' scoped>
.help-link
  font-size 0.85em
  opacity 0.6
  font-style italic
  grid-template-columns 32px auto
  display grid
  cursor pointer
  transition .3s opacity ease-in-out
  &:hover
    opacity 0.9
  & > *
    vertical-align middle
</style>
