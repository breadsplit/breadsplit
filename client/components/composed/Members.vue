<template lang='pug'>
v-card.members
  v-subheader
    v-icon.mr-1 mdi-account-group
    span {{$t('ui.tabs.members')}}

  v-list(two-line)
    template(v-for='(member, index) in members')
      v-list-tile(:key='member.uid', avatar, @click='')
        v-list-tile-avatar
          app-user-avatar(:id='member.uid')
        v-list-tile-content
          v-list-tile-title
            app-user-info(:id='member.uid', field='name')
          v-list-tile-sub-title
            app-user-info(:id='member.uid', field='email')
        v-list-tile-action(v-if='memberMenu(member).length')
          v-menu
            v-btn(icon, flat, slot='activator')
              v-icon mdi-dots-vertical
            v-list
              template(v-for='item in memberMenu(member)')
                v-list-tile(@click='item.handler')
                  v-list-tile-title {{$t(item.title, member)}}
      v-divider
    .px-3.pt-3.py-2
      v-btn(@click='promptNewMember()', dark, color='grey darken-2')
        v-icon.mr-2 mdi-account-plus
        span {{$t('ui.button_new_member')}}

</template>

<script lang='ts'>
import { Component, Vue, Prop, Action } from 'nuxt-property-decorator'
import { IsThisId } from '~/core'
import { Member } from '~/types'

@Component
export default class Members extends Vue {
  @Action('group/addMember') newMember
  @Action('group/editMember') editMember
  @Action('group/removeMember') removeMember

  @Prop({ default: () => ([]) }) readonly members!: Member[]

  get uid() {
    return this.$store.getters['user/uid']
  }
  get me() {
    return this.$store.getters['user/me']
  }

  memberMenu(member) {
    const items: {title: string; handler: () => void}[] = []

    if (IsThisId.LocalMember(member.uid)) {
      items.push({
        title: 'ui.menu.rename_member',
        handler: () => this.promptRenameMember(member),
      })
      items.push({
        title: 'ui.menu.remove_member',
        handler: () => this.promptRemoveMember(member),
      })
    }
    return items
  }

  joinTheGroup() {
    this.newMember({ member: { id: this.uid, name: this.me.name } })
  }

  thisIsMe(member) {
    this.$store.dispatch('group/changeMemberId', { from: member.uid, to: this.uid })
  }

  isLocalMember(id) {
    return IsThisId.LocalMember(id)
  }

  async promptNewMember() {
    const name = await this.$prompt('Name')
    if (name)
      await this.newMember({ member: { name } })
  }

  async promptRenameMember(member) {
    const name = await this.$prompt('Name', member.name)
    if (name)
      await this.editMember({ memberid: member.uid, changes: { name } })
  }

  async promptRemoveMember(member) {
    if (await this.$confirm('Sure?'))
      await this.removeMember({ memberid: member.uid })
  }
}
</script>
