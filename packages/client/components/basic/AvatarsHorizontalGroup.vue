<template lang='pug'>
.avatars-horizontal-group
  app-user-avatar(v-for='c in memberIds' :id='c' :key='c' :size='size')
  app-user-avatar(v-if='overflow' :size='size')
    span(:style='{fontSize: `${size/2}px`}') +{{overflow}}
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class Transactions extends Vue {
  @Prop({ default: () => [] }) readonly ids!: string[]
  @Prop({ default: -1 }) readonly maxLength!: number
  @Prop(String) readonly size!: number|string

  get memberIds() {
    if (this.overflow)
      return this.ids.slice(0, this.maxLength)
    return this.ids
  }

  get overflow() {
    return Math.max(0, this.ids.length - this.maxLength)
  }
}
</script>

<style lang='sass'>
.avatars-horizontal-group
  display: inline-block
  vertical-align: middle

  .user-avatar:not(:first-child)
    margin-left: -8px

  .v-avatar
    .theme--light & img
      border: 2px solid #fff
    .theme--dark & img
      border: 2px solid #424242
</style>
