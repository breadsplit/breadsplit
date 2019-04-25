<template lang="pug">
.member-select
  v-menu(v-model='menu' :nudge-width='100')
    template(v-slot:activator='{ on }')
      .vertical-aligned(v-on='on', v-ripple)
        app-avatar.ma-1(:member='current', inline, name)
        v-icon mdi-menu-down

    v-card.pa-2
      template(v-for='member in members')
        app-avatar.member-option.pa-3(:member='member', name, v-ripple, @click.native='setValue(member.id)')
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Member } from '~/types'
import MemberMixin from '~/mixins/member'

@Component
export default class MemberSelect extends Mixins(MemberMixin) {
  menu = false

  @Prop(String) readonly value!: string
  @Prop(Array) readonly members!: Member[]

  get current() {
    const member = this.members.find(m => m.id === this.value)
    return member || {}
  }

  setValue(value) {
    this.$emit('input', value)
  }
}
</script>

<style lang="stylus">
.member-select
  display inline-block

.member-option
  cursor pointer
</style>
