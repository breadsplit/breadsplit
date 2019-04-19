<template lang='pug'>
div
  v-list(two-line)
    template(v-for='(member, index) in members')
      v-list-tile(:key='member.id', avatar, @click='')
        v-list-tile-avatar
          img(:src='getMemberAvatar(member)')
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

  v-btn(@click='promptNewMember()', color='primary') Add member
</template>

<script>
// TODO: replace prompt with better form
/* eslint-disable no-alert */
import MemberMixin from '~/mixins/member'
import randomstr from '~/utils/randomstr'

export default {
  mixins: [MemberMixin],
  props: {
    members: { type: Array, default: () => ([]) },
  },
  computed: {
    edit_menu() {
      return [
        { title: 'Rename' },
        { title: 'Remove user' },
      ]
    },
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
  },
}
</script>
