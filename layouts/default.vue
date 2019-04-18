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

  v-navigation-drawer(v-model='drawer', :mini-variant='miniVariant', :clipped='clipped', fixed, app)
    v-list.py-2
      template(v-if='books.length')
        v-list-tile.px-2(
          v-for='(book, i) in books'
          :key='i', :to='`/book/${book.id}`'
          router, exact)
          v-list-tile-action
            v-icon {{ book.icon || 'book' }}
          v-list-tile-content
            v-list-tile-title(v-text='book.name')
        v-divider.my-1
      v-list-tile.px-2(@click='newBook')
        v-list-tile-action
          v-icon mdi-plus
        v-list-tile-content
          v-list-tile-title {{$t('ui.book_editing.new_book')}}

      .drawer-list-bottom
        v-list-tile.px-2.my-1
          v-list-tile-action
            v-avatar(size='36', color='#00000020', style='margin: -6px;')
              v-icon mdi-account
          v-list-tile-content
            v-list-tile-title {{$t('ui.sign_in')}}
        v-list-tile.px-2.my-1(@click='$root.$settings.open()')
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
import FontFamilyBuilder from '~/meta/font_family'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class DefaultLayout extends Vue {
  // Data
  dark = false
  clipped = true
  drawer = false
  fixed = false
  miniVariant = false

  // Computed
  get books() {
    return this.$store.state.book.books
  }
  get current() {
    return this.$store.getters['book/current']
  }
  get title() {
    return (this.current || {}).name || this.$t('appname')
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
  bottom 5px
  left 0
  right 0
.app-toolbar
  .v-toolbar__content
    padding-right 2px
</style>
