<template lang='pug'>
.help-link(@click='onClick()')
  v-icon.icon(size='20') mdi-help-circle-outline
  .text
    slot
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class HelpLink extends Vue {
  @Prop({ default: true }) readonly icon!: boolean
  @Prop(String) readonly help?: string

  onClick() {
    // TODO: open help dialog
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
