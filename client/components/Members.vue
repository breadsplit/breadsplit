<template lang='pug'>
v-card
  v-subheader {{$t('ui.tabs.members')}}
  v-list(two-line)
    template(v-for='(member, index) in members')
      v-list-tile(:key='member.id', avatar, @click='')
        v-list-tile-avatar
          app-avatar(:member='member')
        v-list-tile-content
          v-list-tile-title(v-text='member.name')
          v-list-tile-sub-title(v-text='member.email')
        v-list-tile-action
          v-menu
            v-btn(icon, flat, slot='activator')
              v-icon mdi-dots-vertical
            v-list
              v-list-tile(@click='promptRenameMember(member)')
                v-list-tile-title Rename
              v-list-tile(@click='randomAvatar(member)')
                v-list-tile-title Random avatar
              v-list-tile(@click='promptRemoveMember(member)')
                v-list-tile-title Remove from this group
      v-divider
    v-list-tile
      v-btn(@click='promptNewMember()', color='primary')
        v-icon.mr-2 mdi-account-plus
        span {{$t('ui.button_new_member')}}
</template>

<script lang='ts'>
// TODO: replace prompt with better form
/* eslint-disable no-alert */
import MemberMixin from '~/mixins/member'
import randomstr from '~/utils/randomstr'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Member } from '~/types/index'

@Component
export default class Members extends Mixins(MemberMixin) {
  @Prop({ default: () => ([]) }) readonly members!: Member[]

  get edit_menu() {
    return [
      { title: 'Rename' },
      { title: 'Remove user' },
    ]
  }
  promptNewMember() {
    const name = prompt('Name?')
    const email = prompt('Email?')
    if (name)
      this.newMember({ member: { email, name } })
  }
  promptRenameMember(member) {
    const name = prompt('Name?')
    if (name)
      this.editMember({ memberid: member.id, changes: { name } })
  }
  promptRemoveMember(member) {
    if (confirm('Sure?'))
      this.removeMember({ memberid: member.id })
  }
  randomAvatar(member) {
    this.editMember({ memberid: member.id, changes: { avatarHash: randomstr(10) } })
  }
}
</script>
