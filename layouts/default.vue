<template lang='pug'>
v-app(:dark='dark')

  style.
    :root {
      --app-font: {{i18nStyle}};
    }

  v-navigation-drawer(v-model='drawer', :mini-variant='miniVariant', :clipped='clipped', fixed, app)
    v-list.py-2
      template(v-if='books.length')
        v-list-tile.px-2(v-for='(item, i) in books', :key='i', :to='`/book/${item.id}`', router, exact)
          v-list-tile-action
            v-icon {{ item.icon || 'book' }}
          v-list-tile-content
            v-list-tile-title(v-text='item.display')
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
    //v-btn(icon, @click.stop='miniVariant = !miniVariant')
      v-icon {{ `mdi-chevron-${miniVariant ? 'right' : 'left'}` }}
    //v-btn(icon, @click.stop='clipped = !clipped')
      v-icon mdi-book-open-outline
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
    app-form-new-book(@close='$root.$newbook.close()')

  app-confirm(ref='confirm')
</template>

<script>
import FontFamilyBuilder from '~/meta/font_family'

export default {
  data() {
    return {
      dark: false,
      clipped: true,
      drawer: false,
      fixed: false,
      miniVariant: false,
    }
  },
  computed: {
    books() {
      return this.$store.state.book.books
    },
    current() {
      return this.$store.getters['book/current']
    },
    title() {
      return (this.current || {}).display || this.$t('appname')
    },
    i18nStyle() {
      let font_family = this.$t('css.font_family', '')
      const font_of_locale = this.$t('css.font_of_locale', '')
      if (!font_family)
        font_family = FontFamilyBuilder(font_of_locale)
      return font_family
    },
    book_menu() {
      return [
        { title: 'Edit book' },
        { title: 'Delete book' },
      ]
    },
  },
  mounted() {
    this.$root.$confirm = this.$refs.confirm.open
    this.$root.$settings = this.$refs.settings
    this.$root.$newbook = this.$refs.newbook
  },
  methods: {
    async newBook() {
      await this.$root.$newbook.open()
    },
  },
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
