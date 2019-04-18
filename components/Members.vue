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
              v-list-tile(@click='promptRemoveMember(member)')
                v-list-tile-title Remove from this book

  v-btn(@click='promptNewMember()', color='primary') Add member
</template>

<script>
// TODO: replace prompt with better form
/* eslint-disable no-alert */
import MemberMixin from '~/mixins/member'

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
      const email = prompt('Email?')
      const name = prompt('Name?')
      this.newMember({ member: { email, name } })
    },
    promptRenameMember(member) {
      const name = prompt('Name?')
      this.renameMember({ memberid: member.id, name })
    },
    promptRemoveMember(member) {
      if (confirm('Sure?'))
        this.removeMember({ memberid: member.id })
    },
  },
}
</script>
