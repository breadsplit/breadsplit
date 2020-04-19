<template lang='pug'>
v-card.members
  v-subheader
    v-icon.mr-1 mdi-account-group
    span {{$t('ui.tabs.members')}}

  v-list
    template(v-for='(member, index) in members')
      v-list-item.pr-2(:key='member.uid' @click='gotoUserInfo(member.uid)')
        v-list-item-avatar
          app-user-avatar(:id='member.uid' size='38')
        v-list-item-content
          v-list-item-title
            app-user-info(:id='member.uid', field='name')
          v-list-item-subtitle
            app-user-info(:id='member.uid', field='email')

        v-menu(v-if='memberMenu(member).length')
          template(v-slot:activator='{ on }')
            v-btn(icon text small v-on='on')
              v-icon mdi-dots-vertical
          v-list
            template(v-for='item in memberMenu(member)')
              v-list-item(@click='item.handler')
                v-list-item-title {{$t(item.title, member)}}

    .px-3.pt-4.pb-1
      v-btn(@click='promptNewMember()' dark text color='primary')
        v-icon.mr-2 mdi-account-plus
        span {{$t('ui.button_new_member')}}
</template>

<script lang='ts'>
import { Component, Prop, Action, mixins } from 'nuxt-property-decorator'
import { IsThisId } from '~/core'
import { Member } from '~/types'
import { NavigationMixin } from '~/mixins'

@Component
export default class Members extends mixins(NavigationMixin) {
  @Action('group/addMember') newMember
  @Action('group/editMember') editMember
  @Action('group/removeMember') removeMember

  @Prop({ default: () => ([]) }) readonly members!: Member[]

  get uid() {
    return this.$store.getters['user/uid']
  }

  get me() {
    return this.$store.state.user.me
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
    const name = await this.$prompt(this.$t('tips.member_name_input_placeholder'), '', { required: true })
    if (name)
      await this.newMember({ member: { name } })
  }

  async promptRenameMember(member) {
    const name = await this.$prompt(this.$t('tips.member_name_input_placeholder'), member.name, { required: true })
    if (name)
      await this.editMember({ memberid: member.uid, changes: { name } })
  }

  async promptRemoveMember(member) {
    if (await this.$confirm('Sure?'))
      await this.removeMember({ memberid: member.uid })
  }
}
</script>
