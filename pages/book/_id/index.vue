<template lang="pug">
v-layout
  v-flex.text-xs-center
    blockquote.blockquote Hello, {{params.id}}

  v-btn(nuxt, :to='`/book/${params.id}/new`') New
</template>

<script>
export default {
  computed: {
    book() {
      return this.$store.getters['book/current']
    },
  },
  async asyncData({ params, store, error }) {
    store.commit('book/switchToId', params.id)
    if (!store.getters['book/current'])
      return error({ icon: 'mdi-book-outline', statusCode: 'Book not found', message: 'This seems to be a local book, are you sure it\'s stored on this device?' })
    return { params }
  },
  head() {
    return {
      title: this.book.display,
    }
  },
}
</script>
