<template lang='pug'>
v-layout(column, justify-center, align-center)
  v-flex.text-xs-center(xs12, sm8, md6)
    template(v-for='(item, i) in books')
      v-btn.book(:to='`/book/${item.id}`')
        v-icon(size='48') {{ item.icon || 'book' }}
        .bookname(v-text='item.display')

  v-divider.my-3

  v-flex.text-xs-center(xs12, sm8, md6)
    v-btn Create A New Book
</template>

<script>
export default {
  computed: {
    books() {
      return this.$store.state.book.books
    },
  },
}
</script>

<style lang="stylus">
.v-btn.book
  height inherit
  padding 10px
  display inline-block
  .v-btn__content
    display block
    opacity 0.6
    text-align center
  .bookname
    display block
  .v-icon
    font-size 48px

</style>
