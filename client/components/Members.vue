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
        v-list-tile-action
          v-menu
            v-btn(icon, flat, slot='activator')
              v-icon mdi-dots-vertical
            v-list
              template(v-if='member.id.startsWith("lm-")')
                v-list-tile(@click='promptRenameMember(member)')
                  v-list-tile-title Rename
                v-list-tile(@click='randomAvatar(member)')
                  v-list-tile-title Random avatar
                v-list-tile(@click='thisIsMe(member)')
                  v-list-tile-title This is me
              v-list-tile(@click='promptRemoveMember(member)')
                v-list-tile-title Remove from this group
      v-divider
    v-list-tile
      v-btn(@click='promptNewMember()', color='primary')
        v-icon.mr-2 mdi-account-plus
        span {{$t('ui.button_new_member')}}
</template>

<script>
// TODO: replace prompt with better form
/* eslint-disable no-alert */
import MemberMixin from '~/mixins/member'
import { randomstr } from '~/utils/id_helper'

export default {
  mixins: [MemberMixin],
  props: {
    members: { type: Array, default: () => ([]) },
  },
  methods: {
    promptNewMember() {
      const name = prompt('Name?')
      const email = prompt('Email?')
      if (name)
        this.newMember({ member: { email, name } })
    },
    promptRenameMember(member) {
      const name = prompt('Name?')
      if (name)
        this.editMember({ memberid: member.id, changes: { name } })
    },
    promptRemoveMember(member) {
      if (confirm('Sure?'))
        this.removeMember({ memberid: member.id })
    },
    randomAvatar(member) {
      this.editMember({ memberid: member.id, changes: { avatarHash: randomstr(10) } })
    },
    thisIsMe(member) {
      const uid = this.$store.getters['user/uid']
      this.$store.commit('group/changeMemberId', { from: member.id, to: uid })
    },
  },
}
</script>
