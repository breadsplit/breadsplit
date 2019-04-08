<template lang='pug'>
v-app(dark)
  v-navigation-drawer(v-model='drawer', :mini-variant='miniVariant', :clipped='clipped', fixed, app)
    v-list
      v-list-tile(v-for='(item, i) in items', :key='i', :to='item.to', router, exact)
        v-list-tile-action
          v-icon {{ item.icon }}
        v-list-tile-content
          v-list-tile-title(v-text='item.title')
  v-toolbar(:clipped-left='clipped', fixed, app)
    v-toolbar-side-icon(@click='drawer = !drawer')
    v-btn(icon, @click.stop='miniVariant = !miniVariant')
      v-icon {{ `mdi-chevron-${miniVariant ? 'right' : 'left'}` }}
    v-btn(icon, @click.stop='clipped = !clipped')
      v-icon mdi-book-open-outline
    v-toolbar-title(v-text='title')
      v-spacer
        v-btn(icon, @click.stop='rightDrawer = !rightDrawer')
          v-icon mdi-menu
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
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'bubble_chart',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
}
</script>
