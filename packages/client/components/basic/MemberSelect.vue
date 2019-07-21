<template lang='pug'>
.member-select
  v-menu(v-model='menu' max-width='450px')
    template(v-slot:activator='{ on }')
      .vertical-aligned(v-on='on')
        slot
          app-user-avatar(:id='current.uid', inline, show-name)
          v-icon mdi-menu-down

    v-card.pa-2.text-xs-center
      template(v-for='member in members')
        app-user-avatar.member-option.pa-2(:id='member.uid', show-name, v-ripple, @click.native='setValue(member.uid)')
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import UserAvatar from './UserAvatar.vue'
import { Member } from '~/types'

@Component({
  components: { UserAvatar },
})
export default class MemberSelect extends Vue {
  menu = false

  @Prop(String) readonly value!: string
  @Prop(Array) readonly members!: Member[]

  get current () {
    const member = this.members.find(m => m.uid === this.value)
    return member || {}
  }

  setValue (value) {
    this.$emit('input', value)
  }
}
</script>

<style lang='sass'>
.member-select
  display: inline-block

.member-option
  cursor: pointer

.v-menu--inline
  display: block
</style>
