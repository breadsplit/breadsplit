<template lang="pug">
v-app-bar.app-toolbar(app flat color='transparent' height='60').primary--text
  v-btn(v-if='isMobile' icon @click='internalDrawer = !internalDrawer')
    v-icon(color='primary' v-if='group') mdi-{{group.icon}}
    v-icon(color='primary' v-else) mdi-menu

  v-toolbar-title.pl-2(v-text='title')
  v-spacer
  v-toolbar-items
    template(v-if='current')
      app-display-currency-switch

      template(v-if='isOnline')
        app-syncing-state-indicator

      v-menu(offset-y)
        template(v-slot:activator='{ on }')
          v-btn(icon text v-on='on')
            v-icon.op-50 mdi-dots-vertical
        v-list
          v-list-item(v-for='(item, index) in group_menu' :key='index' @click='onGroupMenu(item.key)')
            v-list-item-title {{ $t(item.title) }}

    // User profile
    template(v-if='!user.anonymous')
      v-avatar(size='36' @click='gotoUserInfo()' color='#00000020').avatar-in-toolbar
        img(:src='user.avatar_url')
</template>

<script lang='ts'>
import { Component, Getter, mixins, Prop, Mutation } from 'nuxt-property-decorator'
import { Group, UserInfo } from '~/types'
import { GroupMixin, CommonMixin, NavigationMixin } from '~/mixins'

@Component
export default class NavBar extends mixins(CommonMixin, NavigationMixin, GroupMixin) {
  @Getter('group/current') current: Group | undefined
  @Getter('user/me') user!: UserInfo
  @Getter('user/uid') uid: string | undefined

  @Prop(Boolean) readonly drawer!: boolean

  @Mutation('group/setConfigs') setConfigs

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

    if (this.localOptions.pinned)
      menu.push({ title: 'ui.group_editing.unpin_group', key: 'unpin' })
    else
      menu.push({ title: 'ui.group_editing.pin_group', key: 'pin' })

    menu.push({ title: 'ui.category_editing.title', key: 'edit_categories' })
    menu.push({ title: 'ui.menu.group_setting', key: 'edit' })

    return menu
  }

  async onGroupMenu(key) {
    switch (key) {
      case 'sync':
        await this.syncCurrentGroup()
        break

      case 'edit_categories':
        this.gotoCategories()
        break

      case 'edit':
        this.gotoNewGroup({ mode: 'edit' })
        break

      case 'pin':
        this.setConfigs({ id: this.group.id, field: 'pinned', value: true })
        break

      case 'unpin':
        this.setConfigs({ id: this.group.id, field: 'pinned', value: false })
        break
    }
  }

  async syncCurrentGroup() {
    if (this.current)
      await this.$fire.manualSync(this.current.id)
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

.v-tabs-items
  background-color: transparent !important
</style>
