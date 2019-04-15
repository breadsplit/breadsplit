<template lang="pug">
v-layout
  v-flex.text-xs-center
    blockquote.blockquote Hello, {{params.id}}

  speed-dial(
    bottom, fixed, right, direction='top',
    transition='slide-y-reverse-transition',
    icon='mdi-plus', iconclose='mdi-close',
    :items='speedDialItems', @item-click='speedDialClicked'
  )
</template>

<script>
import BookMixin from '~/mixins/book'
import SpeedDial from '~/components/SpeedDial.vue'

export default {
  components: {
    SpeedDial,
  },
  mixins: [BookMixin],
  data() {
    return {
      fab: false,

    }
  },
  computed: {
    speedDialItems() {
      return [
        {
          text: 'New Expense',
          icon: 'mdi-cash-usd',
          key: 'new-expense',
        }, {
          text: 'Settle Up',
          icon: 'mdi-account-multiple-check',
          key: 'new-transfer',
        }, {
          text: 'New Member',
          icon: 'mdi-account-plus',
          key: 'new-member',
        }]
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
      title: this.book.title,
    }
  },
  methods: {
    speedDialClicked(buttonid) {
      console.log(buttonid)
      switch (buttonid) {
        case 'new-expense':
          this.$router.push(`/book/${this.params.id}/new-record?type=expense`)
          break
        case 'new-transfer':
          this.$router.push(`/book/${this.params.id}/new-record?type=transfer`)
          break
      }
    },
  },
}
</script>
