<template lang='pug'>
.group-page
  .scroll-page
    v-tabs-items(v-model='tab_index', v-if='group').pt-1
      v-tab-item(key='0')
        v-container(:class='{"pa-0": isMobile}')
          app-balances

      v-tab-item(key='1')
        v-container(:class='{"pa-0": isMobile}')

          app-transactions

          v-alert(:value='true', type='warning') Work in progress...
          pre {{JSON.stringify(group, null, 2)}}

      v-tab-item(key='2')
        v-container(:class='{"pa-0": isMobile}')
          app-activities

      v-tab-item(key='3')
        v-container(:class='{"pa-0": isMobile}')
          app-members(:members='members')

    div(style='height:15px')

  v-bottom-nav(:active.sync='tab_id', :value='true', :absolute='!isMobile', :fixed='isMobile')
    template(v-for='item in tabItems')
      v-btn(
        color='primary' flat :style='item.style'
        :value='item.key', :disabled='item.disabled')
        span {{item.text}}
        v-icon mdi-{{item.icon}}

  v-fab-transition
    v-btn(
      fab color='primary'
      :style='fabStyle'
      @click='gotoNewTransaction()'
    )
      v-icon mdi-plus

  nuxt-child
</template>

<script lang='ts'>
import { GroupMixin, CommonMixin, NavigationMixin } from '~/mixins'
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
  async asyncData({ params, store, error }) {
    if (!store.getters['group/current'])
      // @ts-ignore
      return error({ icon: 'account-alert-outline', statusCode: 'Group not found', message: 'It seems to be a local group' })
    return { params }
  },
})
export default class GroupPage extends Mixins(CommonMixin, NavigationMixin, GroupMixin) {
  fab = false
  tab_index = 0
  tab_id: string|null = 'summary'

  // Computed
  get tabItems() {
    return [
      {
        text: this.$t('ui.tabs.summary'),
        icon: 'chart-pie',
        key: 'summary',
      }, {
        text: this.$t('ui.tabs.expenses'),
        icon: 'wallet',
        key: 'expenses',
        style: 'margin-right: 25px',
      }, {
        text: this.$t('ui.tabs.activities'),
        icon: 'calendar-text',
        key: 'activities',
        style: 'margin-left: 25px',
      }, {
        text: this.$t('ui.tabs.members'),
        icon: 'account-group',
        key: 'members',
      }]
  }
  get speedDialShow() {
    return this.tab_index === 0
  }
  get fabStyle() {
    const style = {
      right: '50%',
      bottom: '12px',
      transform: 'translateX(50%)',
      position: this.isMobile ? 'fixed' : 'absolute',
      'z-index': 5,
      margin: '0',
    }

    return style
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
}
</script>

<style lang='stylus'>
.v-bottom-nav
  border-top 1px solid rgba(125,125,125,0.3)
</style>
