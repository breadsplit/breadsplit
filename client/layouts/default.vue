<template lang='pug'>
v-app(:dark='dark')
  style.
    :root {
      --app-font: {{localeFont}};
    }
    .primary {
      background-color: {{primaryColor}} !important;
      border-color: {{primaryColor}} !important;
    }
    .primary--text {
      color: {{primaryColor}} !important;
      caret-color: {{primaryColor}} !important;
    }

  template(v-if='$store.state.webview')
    v-content
      app-inside-webview

  template(v-else)
    v-navigation-drawer(
      v-model='drawer', :mini-variant='miniVariant'
      :clipped='clipped', fixed, app, :mobile-break-point='mobileBreakPoint'
    )
      v-list
        v-list-tile
          v-list-tile-content
            v-list-tile-title.app-name {{$t('appname')}}
        v-divider.my-1

        template(v-if='groups.length')
          v-list-tile(
            v-for='(group, i) in groups'
            :key='i', :to='`/group/${group.id}`'
            router, exact)
            v-list-tile-action
              v-icon mdi-{{ group.icon }}
            v-list-tile-content
              v-list-tile-title(v-text='group.name')
            v-list-tile-action(v-if='group.online')
              template(v-if='isSync(group.id)')
                v-icon.syncing-icon(color='grey lighten-1', size='20') mdi-cloud-sync
              template(v-else)
                v-icon(color='grey lighten-1', size='20') mdi-cloud-outline

          v-divider.my-1

        // New group item
        v-list-tile(@click='$refs.newgroup.open()')
          v-list-tile-action
            v-icon mdi-plus
          v-list-tile-content
            v-list-tile-title {{$t('ui.group_editing.new_group')}}

        // Join group button
        v-list-tile(v-if='!user.anonymous' @click='joinGroup')
          v-list-tile-action
            v-icon mdi-shape-circle-plus
          v-list-tile-content
            v-list-tile-title {{$t('ui.button_join_group')}}

        .drawer-list-bottom

          // Homepage
          v-list-tile(@click='$router.push("/")', v-show='$route.path !== "/"')
            v-list-tile-action
              v-icon mdi-home
            v-list-tile-content
              v-list-tile-title {{$t('ui.homepage')}}

          // Sign in
          template(v-if='user.anonymous')
            v-list-tile(@click='$refs.login.open()')
              v-list-tile-action
                v-avatar(size='36', color='#00000020', style='margin: -6px;')
                  v-icon mdi-account
              v-list-tile-content
                v-list-tile-title {{$t('ui.sign_in')}}

          // User profile
          template(v-else)
            v-list-tile(@click='promptLogout()')
              v-list-tile-action
                v-avatar(size='36', color='#00000020', style='margin: -6px;')
                  img(:src='user.avatar_url')
              v-list-tile-content
                v-list-tile-title {{ user.name || user.email }}
              v-list-tile-action(v-if='!userIsOnline')
                v-icon(color='red', size='20') mdi-cloud-off-outline

          // Settings
          v-list-tile(@click='$refs.settings.open()')
            v-list-tile-action
              v-icon mdi-settings
            v-list-tile-content
              v-list-tile-title {{$t('ui.settings')}}

    v-toolbar.app-toolbar(
      :clipped-left='clipped' app flat color='transparent' height='60'
      ).primary--text
      v-btn(icon, flat, @click='drawer = !drawer')
        v-icon(color='primary') mdi-menu
      v-toolbar-title(v-text='title')
      v-spacer
      v-toolbar-items(v-if='current')
        template(v-if='isSync()')
          v-btn(icon, flat).syncing-icon
            v-icon(color='primary') mdi-cloud-sync
        template(v-if='currentShareLink')
          v-btn(icon, flat, @click='copyShareLink()')
            v-icon.op-50 mdi-share-variant
        v-menu(offset-y='')
          v-btn(icon, flat, slot='activator')
            v-icon.op-50 mdi-dots-vertical
          v-list
            v-list-tile(v-for='(item, index) in group_menu', :key='index', @click='onGroupMenu(item.key)')
              v-list-tile-title {{ $t(item.title) }}

    v-content
      nuxt

    app-dialog(ref='newgroup', :route='true', persistent, no-click-animation)
      app-form-new-group(@close='$refs.newgroup.close()')

    app-dialog(ref='settings', :route='true', :fullscreen='true')
      app-settings(@close='$refs.settings.close()')

    app-dialog(ref='login', :route='true', :fullscreen='false')
      app-login(@close='$refs.login.close()')

    app-dialog(ref='about', :route='true', :fullscreen='true')
      app-about-page(@close='$refs.about.close()')

    app-confirm(ref='confirm')

    app-snackbar(ref='snack')
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { Group, UserInfo } from '../types/models'
import CommonMixin from '../mixins/common'
import FontFamilyBuilder from '../meta/font_family'

@Component
export default class DefaultLayout extends Mixins(CommonMixin) {
  // Data
  clipped = false
  drawer = false
  fixed = false
  miniVariant = false
  mobileBreakPoint = 700

  @Getter('group/all') groups!: Group[]
  @Getter('group/current') current: Group | undefined
  @Getter('group/currentShareLink') currentShareLink: string | undefined
  @Getter('user/me') user!: UserInfo
  @Getter('user/online') userIsOnline!: boolean

  @Mutation('group/remove') removeGroup

  // Computed
  get debug() {
    return process.env.NODE_ENV !== 'production'
  }
  get dark() {
    return this.$store.getters.dark
  }
  get title() {
    if (this.current)
      return this.current.name
    else
      return this.$t('appname')
  }
  get localeFont() {
    const font_of_locale = this.$t('css.font_of_locale', '').toString()
    return FontFamilyBuilder(font_of_locale)
  }
  get group_menu() {
    const menu: ({title: string; key: string})[] = []

    menu.push({ title: 'ui.menu.edit_group', key: 'edit' })
    if (this.current && !this.current.online)
      menu.push({ title: 'ui.menu.make_group_online', key: 'transfer_online' })
    menu.push({ title: 'ui.menu.remove_group', key: 'delete' })

    return menu
  }
  get primaryColor() {
    return this.$store.getters.primary
  }

  // Methods
  mounted() {
    // @ts-ignore
    this.$root.$snack = this.$refs.snack.open
    // @ts-ignore
    this.$root.$confirm = this.$refs.confirm.open
    // @ts-ignore
    this.$root.$newgroup = this.$refs.newgroup
    // @ts-ignore
    this.$root.$settings = this.$refs.settings
    // @ts-ignore
    this.$root.$about = this.$refs.about
    // @ts-ignore
    this.$root.login = this.$refs.login

    if (!this.isMobile)
      this.drawer = true
  }

  async onGroupMenu(key) {
    switch (key) {
      case 'delete':
        // @ts-ignore
        if (await this.$root.$confirm('Are you sure?')) {
          const groupid = this.$store.state.group.currentId
          if (this.current && this.current.online)
            await this.$fire.deleteGroup(groupid)
          this.removeGroup()
          this.$router.push('/')
        }
        break

      case 'transfer_online':
        // @ts-ignore
        if (await this.$root.$confirm('Are you sure?'))
          await this.$fire.publishGroup({ groupid: this.$store.state.group.currentId })

        break

      case 'sync':
        await this.syncCurrentGroup()
        break

      case 'edit':
        // TODO:
        break
    }
  }

  async loginWithGoogle() {
    await this.$fire.loginWithGoogle()
  }

  async promptLogout() {
    // @ts-ignore
    if (await this.$root.$confirm('Are you sure to logout?'))
      await this.$fire.logout()
  }

  async joinGroup() {
    const id = prompt('Group ID')
    if (id)
      this.$router.push(`/join?id=${id}`)
  }

  async syncCurrentGroup() {
    if (this.current)
      await this.$fire.manualSync(this.current.id)
  }

  async copyShareLink() {
    if (this.currentShareLink)
      await this.$copyText(this.currentShareLink)
    alert(this.$t('ui.share_link_copied'))
  }

  isSync(id) {
    return this.$store.getters['group/isSyncing'](id)
  }
}
</script>

<style lang='stylus'>
.drawer-list-bottom
  position absolute
  bottom 10px
  left 0
  right 0

.app-toolbar
  .v-toolbar__content
    padding-right 2px

.app-name
  font-size 1.3em
  font-weight bold

.v-navigation-drawer
  .v-list__tile
    height 52px

  &:not(.v-navigation-drawer--mini-variant)
    .v-list
      padding 10px 0

    .v-list__tile
      padding 6px 24px
</style>
