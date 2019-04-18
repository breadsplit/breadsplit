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
      template(v-if='books.length')
        v-list-tile(
          v-for='(book, i) in books'
          :key='i', :to='`/book/${book.id}`'
          router, exact)
          v-list-tile-action
            v-icon {{ book.icon || 'book' }}
          v-list-tile-content
            v-list-tile-title(v-text='book.name')
        v-divider.my-1
      v-list-tile(@click='newBook')
        v-list-tile-action
          v-icon mdi-plus
        v-list-tile-content
          v-list-tile-title {{$t('ui.book_editing.new_book')}}

      .drawer-list-bottom
        // Sign in
        v-list-tile
          v-list-tile-action
            v-avatar(size='36', color='#00000020', style='margin: -6px;')
              v-icon mdi-account
          v-list-tile-content
            v-list-tile-title {{$t('ui.sign_in')}}

        // Homepage
        v-list-tile(@click='$router.push("/")', v-show='$route.path !== "/"')
          v-list-tile-action
            v-icon mdi-home
          v-list-tile-content
            v-list-tile-title Homepage

        // Settings
        v-list-tile(@click='$root.$settings.open()')
          v-list-tile-action
            v-icon mdi-settings
          v-list-tile-content
            v-list-tile-title {{$t('ui.settings')}}

  v-toolbar.app-toolbar(:clipped-left='clipped', fixed, app, dark, color='primary')
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
          v-list-tile(v-for='(item, index) in book_menu', :key='index', @click='')
            v-list-tile-title {{ item.title }}

  v-content
    v-container
      nuxt

  app-dialog(ref='settings', fullscreen, hide-overlay, transition='dialog-bottom-transition')
    app-settings(@close='$root.$settings.close()')

  app-dialog(ref='newbook', fullscreen, hide-overlay, transition='dialog-bottom-transition')
    app-form-new-book(@close='$root.$newBook.close()')

  app-confirm(ref='confirm')
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Book } from '~/types'
import FontFamilyBuilder from '~/meta/font_family'

@Component
export default class DefaultLayout extends Vue {
  // Data
  dark = false
  clipped = true
  drawer = false
  fixed = false
  miniVariant = false
  mobileBreakPoint = 700

  @Getter('book/books') books!: Book[]
  @Getter('book/current') current: Book | undefined

  // Computed
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
  get book_menu() {
    return [
      { title: 'Edit book' },
      { title: 'Delete book' },
    ]
  }
  get primaryColor() {
    return this.$store.getters.primary
  }

  // Methods
  mounted() {
    // @ts-ignore
    this.$root.$confirm = this.$refs.confirm.open
    // @ts-ignore
    this.$root.$settings = this.$refs.settings
    // @ts-ignore
    this.$root.$newBook = this.$refs.newbook

    // @ts-ignore
    if (this.$vuetify.breakpoint.mdAndUp)
      this.drawer = true
  }

  async newBook() {
    // @ts-ignore
    await this.$root.$newBook.open()
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
