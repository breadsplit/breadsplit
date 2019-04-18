<template lang="pug">
.book-page

  v-tabs-items.full-height(v-model='tab_index')
    v-tab-item(key='0')
      p {{book}}

    v-tab-item(key='1')
      app-members(:members='members')

    v-tab-item(key='2')
      p summary

  app-speed-dial(
    bottom, fixed, right, direction='top',
    transition='slide-y-reverse-transition',
    icon='mdi-plus', iconclose='mdi-close',
    style='bottom:80px',:show='speedDialShow'
    :items='speedDialItems', @item-click='speedDialClicked'
  )

  v-bottom-nav(:active.sync='tab_id', :value='true', absolute, color='white')
    template(v-for='item in tabItems')
      v-btn(color='primary', flat, :value='item.key')
        span {{item.text}}
        v-icon {{item.icon}}

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
      tab_index: 0,
      tab_id: 'expenses',
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
    tabItems() {
      return [
        {
          text: this.$t('ui.tabs.expenses'),
          icon: 'mdi-wallet',
          key: 'expenses',
        }, {
          text: this.$t('ui.tabs.members'),
          icon: 'mdi-account-group',
          key: 'members',
        }, {
          text: this.$t('ui.tabs.summary'),
          icon: 'mdi-chart-pie',
          key: 'summary',
        }]
    },
    speedDialShow() {
      return this.tab_index === 0
    },
  },
  watch: {
    tab_index() {
      this.tab_id = (this.tabItems[this.tab_index] || {}).key || null
    },
    tab_id() {
      const tab = this.tabItems.find(t => t.key === this.tab_id)
      this.tab_index = this.tabItems.indexOf(tab)
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
      title: (this.book || {}).name,
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

<style lang="stylus">
.book-page
  height 100%

.v-window.full-height
  height 100%
  padding-bottom 56px

  .v-window__container
    height 100%

    .v-window-item
      height 100%
      overflow auto
</style>
