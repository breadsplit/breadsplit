<template lang='pug'>
v-card
  v-subheader {{$t('ui.tabs.members')}}
  v-list(two-line)
    template(v-for='(member, index) in members')
      v-list-tile(:key='member.id', avatar, @click='')
        v-list-tile-avatar
          app-user-avatar(:id='member.id')
        v-list-tile-content
          v-list-tile-title
            app-user-info(:id='member.id', field='name')
          v-list-tile-sub-title
            app-user-info(:id='member.id', field='email')
        v-list-tile-action(v-if='memberMenu(member).length')
          v-menu
            v-btn(icon, flat, slot='activator')
              v-icon mdi-dots-vertical
            v-list
              template(v-for='item in memberMenu(member)')
                v-list-tile(@click='item.handler')
                  v-list-tile-title {{item.title}}
      v-divider
    v-list-tile
      v-btn(v-if='!iamJoined', @click='joinTheGroup()', color='primary', large, round).pl-0
        app-user-avatar(:id='uid', :size='44').mr-3
        span Join as {{me.name}}
      v-btn(@click='promptNewMember()', dark, color='grey darken-2')
        v-icon.mr-2 mdi-account-plus
        span {{$t('ui.button_new_member')}}
</template>

<script lang='ts'>
// TODO: replace prompt with better form
/* eslint-disable no-alert */
import MemberMixin from '~/mixins/member'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { IsThisId } from '~/utils/id_helper'
import { Member } from '~/types/models'

@Component
export default class Members extends Mixins(MemberMixin) {
  @Prop({ default: () => ([]) }) readonly members!: Member[]

  get uid() {
    return this.$store.getters['user/uid']
  }
  get me() {
    return this.$store.getters['user/me']
  }
  get iamJoined() {
    for (const m of this.members) {
      if (m.id === this.uid)
        return true
    }
    return false
  }

  memberMenu(member) {
    const items: {title: string; handler: () => void}[] = []
    if (IsThisId.LocalMember(member.id)) {
      items.push({
        title: 'Rename',
        handler: () => this.promptRenameMember(member),
      })
      if (!this.iamJoined) {
        items.push({
          title: 'This is me',
          handler: () => this.thisIsMe(member),
        })
      }
      items.push({
        title: 'Remove from group',
        handler: () => this.promptRemoveMember(member),
      })
    }
    return items
  }

  joinTheGroup() {
    this.newMember({ member: { id: this.uid, name: this.me.name } })
  }

  thisIsMe(member) {
    this.$store.commit('group/changeMemberId', { from: member.id, to: this.uid })
  }

  isLocalMember(id) {
    return IsThisId.LocalMember(id)
  }

  promptNewMember() {
    const name = prompt('Name?')
    if (name)
      this.newMember({ member: { name } })
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
}
</script>
