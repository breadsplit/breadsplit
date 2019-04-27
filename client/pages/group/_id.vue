<template lang="pug">
.group-page
  .scroll-page
    v-tabs-items(v-model='tab_index', v-if='group')
      v-tab-item(key='0')
        v-container(:class='{"pa-0": isMobile}')
          app-balances

          p.my-4

          app-transactions

          p(style='height:80px')

      v-tab-item(key='1')
        v-container
          v-subheader {{$t('ui.tabs.expenses')}}
          v-alert(:value='true', type='warning') Work in progress...
          p {{group}}

      v-tab-item(key='2')
        v-container
          v-subheader {{$t('ui.tabs.activities')}}
          v-alert(:value='true', type='warning') Work in progress...

      v-tab-item(key='3')
        v-container(:class='{"pa-0": isMobile}')
          app-members(:members='members')

    //app-speed-dial(
      bottom fixed right direction='top'
      transition='slide-y-reverse-transition'
      icon='plus' iconclose='close' open-on-hover
      style='bottom:80px' :show='speedDialShow'
      :items='speedDialItems' @item-click='speedDialClicked'
      )

  v-fab-transition
    v-btn(
      fab fixed bottom right color='primary'
      v-show='tab_index === 0' style='bottom:70px'
      @click='openNewTransDialog()'
    )
      v-icon mdi-plus

  v-fab-transition
    v-btn(
      fab fixed bottom right color='primary'
      v-show='tab_index === 3' style='bottom:70px'
      @click='promptNewMember'
    )
      v-icon mdi-account-plus

  v-bottom-nav(
    :active.sync='tab_id', :value='true',
    :absolute='!isMobile', :fixed='isMobile', shift)
    template(v-for='item in tabItems')
      v-btn(color='primary', flat, :value='item.key')
        span {{item.text}}
        v-icon mdi-{{item.icon}}

  nuxt-child(:key="$route.params.id")
</template>

<script lang='ts'>
import GroupMixin from '~/mixins/group'
import CommonMixin from '~/mixins/common'
import MemberMixin from '~/mixins/member'
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
export default class GroupPage extends Mixins(CommonMixin, MemberMixin, GroupMixin) {
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
      }, {
        text: this.$t('ui.tabs.activities'),
        icon: 'calendar-text',
        key: 'activities',
      }, {
        text: this.$t('ui.tabs.members'),
        icon: 'account-group',
        key: 'members',
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

  promptNewMember() {
    const name = prompt('Name?')
    if (name)
      this.newMember({ member: { name } })
  }

  openNewTransDialog(options = { type: 'expense' }) {
    this.$router.push(`/group/${this.group.id}/new_trans?type=${options.type}`)
  }
}
</script>

<style lang="stylus">
.v-bottom-nav
  border-top 1px solid rgba(125,125,125,0.3)
</style>
