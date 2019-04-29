<template lang='pug'>
v-app(:dark='dark')

  style.
    :root {
      --app-font: {{i18nStyle}};
    }
    .primary {
      background-color: {{primaryColor}} !important;
      border-color: {{primaryColor}} !important;
    }
    .primary--text {
      color: {{primaryColor}} !important;
      caret-color: {{primaryColor}} !important;
    }

  v-navigation-drawer(
    v-model='drawer', :mini-variant='miniVariant'
    :clipped='clipped', fixed, app, :mobile-break-point='mobileBreakPoint'
  )
    v-list
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
            v-icon(color='grey lighten-1', size='20') mdi-cloud-outline

        v-divider.my-1
      v-list-tile(@click='newGroup')
        v-list-tile-action
          v-icon mdi-plus
        v-list-tile-content
          v-list-tile-title {{$t('ui.group_editing.new_group')}}

      v-list-tile(@click='joinGroup')
        v-list-tile-action
          v-icon mdi-shape-circle-plus
        v-list-tile-content
          v-list-tile-title Join a group

      .drawer-list-bottom

        // Homepage
        v-list-tile(@click='$router.push("/")', v-show='$route.path !== "/"')
          v-list-tile-action
            v-icon mdi-home
          v-list-tile-content
            v-list-tile-title {{$t('ui.homepage')}}

        v-list-tile(v-if='debug', nuxt, to='/test')
          v-list-tile-action
            v-icon mdi-bug
          v-list-tile-content
            v-list-tile-title Test playground

        template(v-if='user.anonymous')
          // Sign in
          v-list-tile(@click='loginWithGoogle()')
            v-list-tile-action
              v-avatar(size='36', color='#00000020', style='margin: -6px;')
                v-icon mdi-account
            v-list-tile-content
              v-list-tile-title {{$t('ui.sign_in')}}

        template(v-else)
          v-list-tile(@click='promptLogout()')
            v-list-tile-action
              v-avatar(size='36', color='#00000020', style='margin: -6px;')
                img(:src='user.avatar_url')
            v-list-tile-content
              v-list-tile-title {{ user.display_name || user.email }}
            v-list-tile-action(v-if='!userIsOnline')
              v-icon(color='red', size='20') mdi-cloud-off-outline

        // Settings
        v-list-tile(@click='$router.push("/settings")')
          v-list-tile-action
            v-icon mdi-settings
          v-list-tile-content
            v-list-tile-title {{$t('ui.settings')}}

  v-toolbar.app-toolbar(
    :clipped-left='clipped'
    fixed, app, dark, color='primary'
    )
    v-toolbar-side-icon(@click='drawer = !drawer')
    v-toolbar-title(v-text='title')
      v-spacer
        v-btn(icon, @click.stop='rightDrawer = !rightDrawer')
          v-icon mdi-menu
    v-spacer
    v-toolbar-items(v-show='current')
      v-menu(offset-y='')
        v-btn(icon, flat, slot='activator')
          v-icon mdi-dots-vertical
        v-list
          v-list-tile(v-for='(item, index) in group_menu', :key='index', @click='onGroupMenu(item.key)')
            v-list-tile-title {{ item.title }}

  v-content
    nuxt

  app-dialog(ref='newgroup', fullscreen, hide-overlay, transition='dialog-bottom-transition')
    app-form-new-group(@close='$root.$newGroup.close()')

  app-confirm(ref='confirm')
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { Group } from '~/types'
import CommonMixin from '~/mixins/common'
import FontFamilyBuilder from '~/meta/font_family'
import { UserInfo } from '~/types/store'

@Component
export default class DefaultLayout extends Mixins(CommonMixin) {
  // Data
  clipped = true
  drawer = false
  fixed = false
  miniVariant = false
  mobileBreakPoint = 700

  @Getter('group/groups') groups!: Group[]
  @Getter('group/current') current: Group | undefined
  @Getter('user/info') user!: UserInfo
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
  get i18nStyle() {
    let font_family = this.$t('css.font_family', '')
    const font_of_locale = this.$t('css.font_of_locale', '').toString()
    if (!font_family)
      font_family = FontFamilyBuilder(font_of_locale)
    return font_family
  }
  get group_menu() {
    const menu: ({title: string; key: string})[] = []

    menu.push({ title: 'Edit group', key: 'edit' })
    if (this.current && !this.current.online)
      menu.push({ title: 'Make this group online', key: 'transfer_online' })
    if (this.current && this.current.online)
      menu.push({ title: 'Sync now', key: 'sync' })
    menu.push({ title: 'Delete group', key: 'delete' })

    return menu
  }
  get primaryColor() {
    return this.$store.getters.primary
  }

  // Methods
  mounted() {
    // @ts-ignore
    this.$root.$confirm = this.$refs.confirm.open
    // @ts-ignore
    this.$root.$newGroup = this.$refs.newgroup

    if (!this.isMobile)
      this.drawer = true
  }

  async newGroup() {
    // @ts-ignore
    await this.$root.$newGroup.open()
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
        if (await this.$root.$confirm('Are you sure?')) {
          this.$router.push('/')
          await this.$fire.switchToOnline({ groupid: this.$store.state.group.currentId })
        }
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
      await this.$fire.joinGroup(id)
  }

  async syncCurrentGroup() {
    if (this.current)
      await this.$fire.syncGroup(this.current.id)
  }
}
</script>

<style lang="stylus">
.drawer-list-bottom
  position absolute
  bottom 10px
  left 0
  right 0
.app-toolbar
  .v-toolbar__content
    padding-right 2px

.v-navigation-drawer
  .v-list__tile
    height 52px

  &:not(.v-navigation-drawer--mini-variant)
    .v-list
      padding 10px 0

    .v-list__tile
      padding 6px 24px
</style>
