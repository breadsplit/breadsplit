<template lang='pug'>
v-card
  v-toolbar(dark, color='primary')
    v-btn(icon, dark, @click='close(false)')
      v-icon close
    v-toolbar-title New Book
  v-container
    v-flex
      // TODO:wayne UI, checkout Vuetify docs (Form section)
      p TODO:wayne
    v-flex
      v-btn(@click='create()', color='primary') Create
</template>

<script>

export default {
  data() {
    return {
    }
  },
  methods: {
    close(result) {
      this.$emit('close', result)
    },
    create() {
      // TODO:wayne gather the data from user input
      const payload = {
        display: 'Untitled Book',
        icon: 'mdi-book',
      }
      // "dispatch" refers to Vuex 'actions', please check out Vuex docs
      this.$store.dispatch('book/new', payload)

      this.close()
    },
  },
}
</script>
