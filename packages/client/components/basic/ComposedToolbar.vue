
<template lang="pug">
v-toolbar(:style='{ height: `${height}px` }' v-bind='$attrs')
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
  @Prop({ default: 200 }) height!: number
}
</script>

<style lang="sass">
.composed-toolbar-content
  position: absolute
  left: 0
  right: 0
  bottom: 0
  top: 60px
</style>
