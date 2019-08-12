<template lang="pug">
v-navigation-drawer(
  v-model='internalDrawer' :mini-variant='miniVariant'
  fixed app :mobile-break-point='mobileBreakPoint' width='320'
)
  .height-100(v-rows='"max-content auto max-content"')
    div
      app-logo-name.clickable.py-4(v-if='isMobile' v-ripple @click.native='goHome()')
      v-divider

    v-list(shaped).scrolling
      v-list-item.pl-4.mr-2(
        v-for='(group, i) in groups'
        :key='i'
        :to='`/group/${group.id}`'
        color='primary'
        router exact
      )
        v-list-item-action
          v-icon mdi-{{ group.icon }}
        v-list-item-content
          v-list-item-title(v-text='group.name')
        v-list-item-action(v-if='isOnline')
          template(v-if='unreadsOf(group.id)')
            v-avatar(size='25', color='red' dark)
              v-list-item-title.ma-2(v-text='unreadsOf(group.id)' style='color: white;')
          template(v-else-if='isSyncing(group.id)')
            v-icon.syncing-icon(color='grey lighten-1', size='20') mdi-cloud-sync
          template(v-else)
            v-icon(color='grey lighten-1', size='20') mdi-cloud-outline

    .drawer-list-bottom.pb-2
      v-divider.mb-2

      // New group item
      v-list-item.pl-4(@click='openNewGroupDialog()')
        v-list-item-action
          v-icon mdi-plus
        v-list-item-content
          v-list-item-title {{$t('ui.group_editing.new_group')}}

      // Sign in
      template(v-if='user.anonymous')
        v-list-item.pl-4(@click='openLoginDialog')
          v-list-item-action
            v-avatar(size='36', color='#00000020', style='margin: -6px;')
              v-icon mdi-account
          v-list-item-content
            v-list-item-title {{$t('ui.sign_in')}}

      // User profile
      template(v-else)
        v-list-item.pl-4(@click='promptLogout()')
          v-list-item-action
            v-avatar(size='36' color='#00000020' style='margin: -6px;')
              img(:src='user.avatar_url')
          v-list-item-content
            v-list-item-title {{ user.name || user.email }}
          v-list-item-action(v-if='!userIsOnline')
            v-icon(color='red' size='20') mdi-cloud-off-outline

      // Settings
      v-list-item.pl-4(@click='openSettings()')
        v-list-item-action
          v-icon mdi-settings
        v-list-item-content
          v-list-item-title {{$t('ui.settings')}}

  app-login(ref='login')
</template>

<script lang='ts'>
import { Component, Getter, mixins, Prop } from 'nuxt-property-decorator'
import { Group, UserInfo } from '~/types'
import { GroupMixin, CommonMixin, NavigationMixin } from '~/mixins'
import Login from '~/components/dialogs/Login.vue'

@Component
export default class NavDrawer extends mixins(CommonMixin, NavigationMixin, GroupMixin) {
  // Data
  fixed = false
  miniVariant = false
  mobileBreakPoint = 700

  @Getter('user/me') user!: UserInfo
  @Getter('group/all') groups!: Group[]
  @Getter('user/online') userIsOnline!: boolean

  @Getter('group/unreadsOf') unreadsOf!: (id: string) => number
  @Getter('group/isSyncing') isSyncing!: (id: string) => boolean

  $refs!: {
    login: Login
  }

  @Prop(Boolean) readonly drawer!: boolean
  get internalDrawer () {
    return this.drawer
  }
  set internalDrawer (value: boolean) {
    this.$emit('update:drawer', value)
  }

  mounted () {
    if (!this.isMobile)
      this.internalDrawer = true
  }

  async openNewGroupDialog () {
    this.tryCloseDrawer()
    this.gotoNewGroup()
  }

  async openLoginDialog () {
    this.tryCloseDrawer()
    this.$refs.login.open()
  }

  tryCloseDrawer () {
    if (this.isMobile)
      this.internalDrawer = false
  }

  async promptLogout () {
    if (await this.$confirm(this.$t('prompt.logout_confirm'))) {
      await this.$fire.logout()
      this.gotoHome()
    }
  }

  async openSettings () {
    this.tryCloseDrawer()
    this.openDialog('settings')
  }

  goHome () {
    this.tryCloseDrawer()
    this.gotoHome()
  }
}
</script>

<style lang='sass'>
.v-navigation-drawer
  .v-list__tile
    height: 52px

  &:not(.v-navigation-drawer--mini-variant)
    .v-list
      padding: 10px 0

    .v-list__tile
      padding: 6px 24px
</style>
