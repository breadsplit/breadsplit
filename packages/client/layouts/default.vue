<template lang='pug'>
v-app(:dark='dark')
  app-global-style

  app-nav-drawer(:drawer.sync='drawer')
  app-nav-bar(:drawer.sync='drawer')

  v-content
    nuxt

  app-global-components
  app-global-dialogs

  app-dialog(ref='welcome', :fullscreen='false')
    app-welcome
</template>

<script lang='ts'>
import { Component, Getter, mixins, Watch } from 'nuxt-property-decorator'
import head from './head'
import { Group } from '~/types'
import { GroupMixin, CommonMixin, NavigationMixin } from '~/mixins'
import Dialog from '~/components/global/Dialog.vue'
import AppNavDrawer from '~/components/app/NavDrawer.vue'
import AppNavBar from '~/components/app/NavBar.vue'

@Component({
  head,
  components: {
    AppNavDrawer,
    AppNavBar,
  },
})
export default class DefaultLayout extends mixins(CommonMixin, NavigationMixin, GroupMixin) {
  drawer = false

  @Getter('group/current') current: Group | undefined
  @Getter('dark') dark!: boolean

  $refs!: {
    welcome: Dialog
  }

  // Methods
  mounted () {
    if (!this.isMobile)
      this.drawer = true

    setTimeout(() => this.checkFirstStart(), 1000)
  }

  @Watch('dark', { immediate: true })
  onThemeChanged () {
    this.$vuetify.theme.dark = this.dark
  }

  async checkFirstStart () {
    if (!this.$store.state.app.init) {
      this.$store.commit('init')
      await this.$refs.welcome.open()
    }
  }
}
</script>
