<template lang="pug">
.member-select
  v-menu(v-model='menu' :nudge-width='100')
    template(v-slot:activator='{ on }')
      .vertical-aligned(v-on='on', v-ripple)
        v-avatar.ma-1
          img(:src='getMemberAvatar(current)')
        strong.pa-1 {{current.name}}
        v-icon mdi-menu-down

    v-card.pa-2
      template(v-for='member in members')
        app-action-with-text.pa-3.member-option(v-ripple)
          v-avatar(slot='action', @click='setValue(member.id)')
            img(:src='getMemberAvatar(member)')
          span(slot='text') {{member.name}}
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Member } from '~/types'
import MemberMixin from '~/mixins/member'

@Component
export default class extends Mixins(MemberMixin) {
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
