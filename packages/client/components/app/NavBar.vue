<template lang="pug">
v-app-bar.app-toolbar(app flat color='transparent' height='60').primary--text
  v-btn(v-if='isMobile' icon text @click='internalDrawer = !internalDrawer')
    v-icon(color='primary') mdi-menu
  .ml-3(v-else)
  v-toolbar-title(v-text='title')
  v-spacer
  v-toolbar-items
    template(v-if='current')
      template(v-if='isSyncing()')
        v-btn(icon text).syncing-icon
          v-icon(color='primary') mdi-cloud-sync
      template(v-if='currentShareLink')
        v-btn(icon text @click='copyShareLink()')
          v-icon.op-50 mdi-share-variant
      v-menu(offset-y)
        template(v-slot:activator='{ on }')
          v-btn(icon text v-on='on')
            v-icon.op-50 mdi-dots-vertical
        v-list
          v-list-item(v-for='(item, index) in group_menu' :key='index' @click='onGroupMenu(item.key)')
            v-list-item-title {{ $t(item.title) }}

    // User profile
    template(v-if='!user.anonymous')
      v-avatar(size='36' @click='promptLogout()' color='#00000020').avatar-in-toolbar
        img(:src='user.avatar_url')
</template>

<script lang='ts'>
import { Component, Getter, mixins, Mutation, Prop } from 'nuxt-property-decorator'
import { Group, UserInfo } from '~/types'
import { GroupMixin, CommonMixin, NavigationMixin } from '~/mixins'

@Component
export default class NavBar extends mixins(CommonMixin, NavigationMixin, GroupMixin) {
  @Getter('group/current') current: Group | undefined
  @Getter('group/currentShareLink') currentShareLink: string | undefined
  @Getter('user/me') user!: UserInfo
  @Getter('user/uid') uid: string | undefined

  @Getter('group/isSyncing') isSyncing!: (id: string) => boolean

  @Mutation('group/remove') removeGroup

  @Prop(Boolean) readonly drawer!: boolean
  get internalDrawer() {
    return this.drawer
  }
  set internalDrawer(value: boolean) {
    this.$emit('update:drawer', value)
  }

  get title() {
    if (this.current)
      return this.current.name
    else
      return this.$t('appname')
  }

  get group_menu() {
    const menu: ({title: string; key: string})[] = []

    menu.push({ title: 'ui.menu.edit_group', key: 'edit' })
    if (this.current && !this.current.online && this.uid)
      menu.push({ title: 'ui.menu.make_group_online', key: 'transfer_online' })
    menu.push({ title: 'ui.menu.remove_group', key: 'delete' })

    return menu
  }

  async onGroupMenu(key) {
    const groupid = this.$store.state.group.currentId
    const group = this.$store.state.group.groups[groupid].base

    switch (key) {
      case 'delete':
        if (await this.$confirm(`確定要刪除 ${group.name} ?`)) {
          this.$apploading.open('Deleting group')
          if (this.current && this.current.online)
            await this.$fire.deleteGroup(groupid)
          this.removeGroup()
          this.$apploading.close()
          this.gotoHome()
        }
        break

      case 'transfer_online':
        if (await this.$confirm('Are you sure?')) {
          this.$apploading.open('Converting to Online group')
          try {
            await this.$fire.publishGroup(this.$store.state.group.currentId)
          }
          catch (e) {
            // eslint-disable-next-line
            console.error(e)
            // TODO:ERROR error handling
          }
          this.$apploading.close()
        }

        break

      case 'sync':
        await this.syncCurrentGroup()
        break

      case 'edit':
        this.openDialog('newgroup', { mode: 'edit' })
        break
    }
  }

  async promptLogout() {
    if (await this.$confirm('Are you sure to logout?')) {
      await this.$fire.logout()
      this.gotoHome()
    }
  }

  async syncCurrentGroup() {
    if (this.current)
      await this.$fire.manualSync(this.current.id)
  }

  async copyShareLink() {
    if (this.currentShareLink)
      await this.$copyText(this.currentShareLink)
    this.$snack(this.$t('ui.share_link_copied', '').toString())
  }
}
</script>

<style lang='sass'>
.app-toolbar
  .v-toolbar__content
    padding-right: 2px

.avatar-in-toolbar
  margin: 12px
  cursor: pointer
</style>