<template lang='pug'>
.member-toggles
  .member.op-animated(
    v-for='uid in uids'
    :class='{"op-25": fade && !isSelected(uid)}'
  )
    .composed-icon(@click='toggle(uid)')
      app-user-avatar(size='48' :id='uid')
      .append
        v-scale-transition
          v-avatar.elevation-1(v-show='isSelected(uid)' size='22' color='primary')
            v-icon(color='white' size='15') mdi-check

    template(v-if='showNames')
      br
      app-user-info.op-75(:id='uid')

</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class UserToggles extends Vue {
  @Prop(Array) readonly uids?: string[]
  @Prop({ default: () => [] }) readonly selected!: string[]
  @Prop({ default: true }) readonly fade!: boolean
  @Prop({ default: true }) readonly showNames!: boolean

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

  .composed-icon
    position relative
    display inline-block

    .append
      position absolute
      bottom -2px
      right -8px

  .member
    padding 0 0.5em
    display inline-block
    cursor pointer
</style>
