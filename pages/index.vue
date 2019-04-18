<template lang='pug'>
v-container
  v-layout(column, justify-center, align-center)
    v-flex.text-xs-center(xs12, sm8, md6)
      template(v-for='(book, i) in books')
        nuxt-link.book-entry(v-ripple, :to='`/book/${book.id}`', :style='bookCssVars(book)')
          v-icon mdi-{{ book.icon || 'book' }}
          .bookname(v-text='book.name')

    v-divider.my-3

    v-flex.text-xs-center(xs12, sm8, md6)
      v-btn(@click='$root.$newBook.open()', color='primary') Create A New Book
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Index extends Vue {
  get books() {
    return this.$store.getters['book/books']
  }

  bookCssVars(book) {
    return {
      '--book-color': book.color,
    }
  }
}
</script>

<style lang='stylus'>
.book-entry
  --book-color #000
  --book-padding 15px

  width 100px
  height 100px
  margin 5px
  display inline-block
  border-radius 10px
  position relative
  border 1px solid rgba(0,0,0,0.1)
  box-shadow 1px 1px 5px 0px rgba(50, 50, 50, 0.1)
  cursor pointer

  .v-btn__content
    display block
    opacity 0.6
    text-align center

  .bookname
    position absolute
    left var(--book-padding)
    bottom var(--book-padding)
    color var(--book-color)
    line-height 1em

  .v-icon
    position absolute
    left var(--book-padding)
    top var(--book-padding)
    color var(--book-color)
    font-size 25px

</style>
