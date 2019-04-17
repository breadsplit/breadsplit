<template lang="pug">
v-layout
  p {{book}}

  app-speed-dial(
    bottom, fixed, right, direction='top',
    transition='slide-y-reverse-transition',
    icon='mdi-plus', iconclose='mdi-close',
    :items='speedDialItems', @item-click='speedDialClicked'
  )

  app-dialog(ref='newRecord', :fullscreen='$vuetify.breakpoint.smAndDown', max-width='800')
    app-form-new-record(v-bind='record_options')
</template>

<script>
import BookMixin from '~/mixins/book'

export default {
  mixins: [BookMixin],
  data() {
    return {
      fab: false,
      record_options: {},
    }
  },
  computed: {
    speedDialItems() {
      return [
        {
          text: this.$t('ui.speed_dials.new_expense'),
          icon: 'mdi-cash-usd',
          key: 'new-expense',
        }, {
          text: this.$t('ui.speed_dials.settle_up'),
          icon: 'mdi-account-multiple-check',
          key: 'new-transfer',
        }, {
          text: this.$t('ui.speed_dials.new_member'),
          icon: 'mdi-account-plus',
          key: 'new-member',
        }]
    },
  },
  async asyncData({ params, store, error }) {
    if (!store.state.loaded)
      return { params }
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
    speedDialClicked(buttonId) {
      switch (buttonId) {
        case 'new-expense':
          this.openNewRecordDialog({ type: 'expense' })
          break
        case 'new-transfer':
          this.openNewRecordDialog({ type: 'transfer' })
          break
      }
    },
    openNewRecordDialog(options = {}) {
      this.record_options = options
      this.$refs.newRecord.open()
    },
  },
}
</script>
