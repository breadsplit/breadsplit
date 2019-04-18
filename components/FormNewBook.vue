<template lang='pug'>
v-card
  v-toolbar(:dark='isDark', :color='book.color')
    v-btn(icon, dark, @click='close(false)')
      v-icon mdi-close
    v-toolbar-title New Book
  v-container
    v-flex
      // TODO:wayne UI, checkout Vuetify docs (Form section)
      p TODO:wayne
      v-text-field(v-model='book.text', :label='book.text', placeholder='Placeholder', box)
      app-swatches(v-model='book.color')
    v-flex
      v-btn(@click='create()', :color='book.color', :dark='isDark') Create
</template>

<script>
import swatches from '~/meta/swatches'

export default {
  data() {
    return {
      book: {
        text: '',
        color: swatches[Math.floor(Math.random() * swatches.length)],
      },
    }
  },
  computed: {
    isDark() {
      return this.$utils.isDark(this.book.color)
    },
  },
  methods: {
    close(result) {
      this.$emit('close', result)
    },
    create() {
      // TODO:wayne gather the data from user input
      const payload = {
        display: this.book.text,
        icon: 'mdi-book',
      }
      // "dispatch" refers to Vuex 'actions', please check out Vuex docs
      this.$store.dispatch('book/new', payload)

      this.close()
    },
  },
}
</script>
