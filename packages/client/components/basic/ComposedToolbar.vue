
<template lang="pug">
v-toolbar(:style='style' v-bind='$attrs')
  slot
  .composed-toolbar-content
    slot(name='content')
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class ComposedToolbar extends Vue {
  @Prop({ default: 'inherit' }) height!: number | string

  get style () {
    let height = this.height
    if (!isNaN(+height))
      height = `${height}px`

    return {
      height,
    }
  }
}
</script>

<style lang="sass">
.composed-toolbar-content
  position: absolute
  left: 0
  right: 0
  bottom: 0
  top: 60px
  .v-text-field__slot
    .v-label--active.primary--text
      color: white !important
</style>
