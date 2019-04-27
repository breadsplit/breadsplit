<template lang="pug">
.group-page
  v-tabs-items.full-height(v-model='tab_index', v-if='group')
    v-tab-item(key='0')
      v-container(:class='{"pa-0": isMobile}')
        app-balances

        p.my-4

        app-transactions

        p(style='height:150px')

    v-tab-item(key='1')
      v-container(:class='{"pa-0": isMobile}')
        app-members(:members='members')

    v-tab-item(key='2')
      v-container
        v-subheader summary
        v-alert(:value='true', type='warning') Work in progress...
        p {{group}}

  app-speed-dial(
    bottom, fixed, right, direction='top',
    transition='slide-y-reverse-transition',
    icon='plus', iconclose='close',
    style='bottom:80px',:show='speedDialShow'
    :items='speedDialItems', @item-click='speedDialClicked'
  )

  v-bottom-nav(
    :active.sync='tab_id', :value='true', fixed, color='white', shift)
    template(v-for='item in tabItems')
      v-btn(color='primary', flat, :value='item.key')
        span {{item.text}}
        v-icon mdi-{{item.icon}}

  app-dialog(
    ref='newRecord' :fullscreen='isMobile'
    max-width='800' transition='dialog-bottom-transition'
  )
    app-form-new-record(v-bind='record_options', @close='$refs.newRecord.close()')
</template>

<script lang='ts'>
import GroupMixin from '~/mixins/group'
import CommonMixin from '~/mixins/common'
import { Component, Mixins, Watch } from 'vue-property-decorator'

@Component({
  head() {
    return {
      meta: [
        { name: 'theme-color', content: this.$store.getters.primary },
      ],
      title: (this.$store.getters['group/current'] || {}).name,
    }
  },
})
export default class GroupIndex extends Mixins(CommonMixin, GroupMixin) {
  fab = false
  record_options = {}
  tab_index = 0
  tab_id: string|null = 'expenses'

  // Computed

  get speedDialItems() {
    return [
      {
        text: this.$t('ui.speed_dials.new_expense'),
        icon: 'cash-usd',
        key: 'new-expense',
      }, {
        text: this.$t('ui.speed_dials.settle_up'),
        icon: 'account-multiple-check',
        key: 'new-transfer',
      }, {
        text: this.$t('ui.speed_dials.new_member'),
        icon: 'account-plus',
        key: 'new-member',
      }]
  }
  get tabItems() {
    return [
      {
        text: this.$t('ui.tabs.expenses'),
        icon: 'wallet',
        key: 'expenses',
      }, {
        text: this.$t('ui.tabs.members'),
        icon: 'account-group',
        key: 'members',
      }, {
        text: this.$t('ui.tabs.summary'),
        icon: 'chart-pie',
        key: 'summary',
      }]
  }
  get speedDialShow() {
    return this.tab_index === 0
  }
  // Watches

  @Watch('tab_index')
  onTabIndexChanged() {
    this.tab_id = (this.tabItems[this.tab_index] || {}).key || null
  }

  @Watch('tab_id')
  onTabIdChanged() {
    const tab = this.tabItems.find(t => t.key === this.tab_id)
    this.tab_index = tab ? this.tabItems.indexOf(tab) : -1
  }

  // Methods
  async asyncData({ params, store, error }) {
    if (!store.state.loaded)
      return { params }
    if (!store.getters['group/current'])
      return error({ icon: 'group-outline', statusCode: 'Group not found', message: 'This seems to be a local group, are you sure it\'s stored on this device?' })
    return { params }
  }

  speedDialClicked(buttonId) {
    switch (buttonId) {
      case 'new-expense':
        this.openNewRecordDialog({ type: 'expense' })
        break
      case 'new-transfer':
        this.openNewRecordDialog({ type: 'transfer' })
        break
    }
  }
  openNewRecordDialog(options = {}) {
    this.record_options = options
    // @ts-ignore
    this.$refs.newRecord.open()
  }
}
</script>

<style lang="stylus">
.group-page
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
