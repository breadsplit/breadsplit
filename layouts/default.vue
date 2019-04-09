<template lang='pug'>
v-app(:dark='dark')
  v-navigation-drawer(v-model='drawer', :mini-variant='miniVariant', :clipped='clipped', fixed, app)
    v-list.py-2
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
          v-list-tile-title {{$t('ui.new_book')}}

      v-list-tile.drawer-list-bottom.px-2.my-1(@click='$router.push("/settings")')
        v-list-tile-action
          v-icon mdi-settings
        v-list-tile-content
          v-list-tile-title {{$t('ui.settings')}}

  v-toolbar(:clipped-left='clipped', fixed, app)
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
    v-toolbar-items
      v-menu(offset-y='')
        v-btn(flat, slot='activator')
          v-avatar(size='40').mx-2
            img(src='https://picsum.photos/200?image=134')
          span {{ $store.state.user.displayname || $t('ui.guest') }}
          v-icon mdi-menu-down
        v-list
          v-list-tile(v-for='(item, index) in items', :key='index', @click='')
            v-list-tile-title {{ item.title }}
  v-content
    v-container
      nuxt
  v-navigation-drawer(v-model='rightDrawer', :right='right', temporary, fixed)
    v-list
      v-list-tile(@click.native='right = !right')
        v-list-tile-action
          v-icon(light) mdi-compare-arrows
        v-list-tile-title Switch drawer (click me)
</template>

<script>
export default {
  data() {
    return {
      dark: false,
      clipped: true,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      items: [
        { title: 'Logout' },
      ],
    }
  },
  computed: {
    books() {
      return this.$store.state.book.books
    },
    title() {
      return (this.$store.getters['book/current'] || {}).display || 'MoneyFlow'
    },
  },
  methods: {
    newBook() {
      // TODO: make a dialog to input the data
      this.$store.dispatch('book/new', { display: 'Untitled Book' })
    },
  },
}
</script>

<style lang="stylus">
.drawer-list-bottom
  position absolute
  bottom 0
  left 0
  right 0
</style>
