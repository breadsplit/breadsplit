<template lang='pug'>
.member-toggles
  .member(
    v-for='uid in uids'
  )
    .icon-merge(@click='toggle(uid)')
      app-user-avatar.op-ani(
        size='48' :id='uid'
        :class='{"op-25": fade && !isSelected(uid)}'
      )
      .append
        v-scale-transition
          v-avatar.elevation-1(v-show='isSelected(uid)' size='22' color='primary')
            v-icon(color='white' size='15') mdi-check
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class UserToggles extends Vue {
  @Prop(Array) readonly uids?: string[]
  @Prop({ default: () => [] }) readonly selected!: string[]
  @Prop({ default: true }) readonly fade!: boolean

  toggle(uid: string) {
    this.$emit('select', uid)
  }

  isSelected(uid: string) {
    return this.selected.includes(uid)
  }
}
</script>

<style lang='stylus'>
.member-toggles
  padding 1em 2em

  .member
    padding 0.5em
    display inline-block
    cursor pointer
</style>
