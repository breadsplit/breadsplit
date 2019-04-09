<template lang="pug">
v-layout
  v-flex(text-xs-center='')
    blockquote.blockquote Hello, {{params.id}}
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
      return error('Book not found')
    return { params }
  },
  head() {
    return {
      title: this.book.display,
    }
  },
}
</script>
