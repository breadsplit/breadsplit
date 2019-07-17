<template lang='pug'>
.help-link(@click='onClick()')
  div(v-columns='"32px auto"')
    v-icon.icon(size='20') mdi-help-circle-outline
    .text(v-if='tips')
      slot {{$t(`help.${help}.tips`)}}

  v-dialog(v-model='dialog', width='350px')
    help-dialog(:help='help', @close='dialog = false')
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import HelpDialog from './HelpDialog.vue'

@Component({
  components: { HelpDialog },
})
export default class HelpLink extends Vue {
  dialog = false

  @Prop({ default: true }) readonly icon!: boolean
  @Prop(String) readonly help?: string
  @Prop(Boolean) readonly tips?: boolean

  onClick () {
    this.dialog = true
  }
}
</script>

<style lang='sass' scoped>
.help-link
  font-size: 0.85em
  opacity: 0.6
  font-style: italic
  display: inline-block
  cursor: pointer
  transition: .3s opacity ease-in-out
  &:hover
    opacity: 0.9
  & > *
    vertical-align: middle
</style>
