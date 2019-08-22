<template lang='pug'>
.group-page.height-100(style='margin-bottom: -60px')
  v-window(v-model='tab_index' v-if='group' touchless).pt-1
    v-window-item(key='0').scroll-page
      v-container(:class='{"pa-0": isMobile}')

        template(v-if='!group.transactions.length')
          app-empty-placeholder(
            icon='balloon'
            :title='$t("placeholders.transactions.title")'
            :desc='$t("placeholders.transactions.desc")'
          )
            v-btn(color='primary' rounded @click='gotoNewTransaction()')
              v-icon.mr-2 mdi-plus
              | {{$t('ui.button_new_transaction')}}

        template(v-else)
          app-balances

          .pa-2

          app-recent-transactions(:limit='3' @show-all='tab_index=1')

          .pa-2

          app-settle-up

          .pa-2

    v-window-item(key='1').scroll-page
      v-container(:class='{"pa-0": isMobile}')

        app-expenses-report

        .pa-2

    v-window-item(key='2').scroll-page
      v-container(:class='{"pa-0": isMobile}')

        app-activities

        .pa-2

    v-window-item(key='3').scroll-page
      v-container(:class='{"pa-0": isMobile}')

        app-inviting(v-if='isOnline')
        app-members(:members='members')

        .pa-2

  v-bottom-navigation(
    v-model='tab_id'
    :absolute='!isMobile'
    :fixed='isMobile'
    :horizontal='!isMobile'
    :grow='isMobile'
    color='primary'
  )
    template(v-for='item in tabItems')
      v-btn(
        :style='item.style'
        :value='item.key'
        :disabled='item.disabled'
        :ripple='false'
      )
        span {{item.text}}
        v-icon mdi-{{item.icon}}

  v-fab-transition
    v-btn.new-transaction-button(
      fab color='primary'
      :style='fabStyle'
      @click='gotoNewTransaction()'
    )
      v-icon mdi-plus
</template>

<script lang='ts'>
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { GroupMixin, CommonMixin, NavigationMixin } from '~/mixins'

@Component({
  head () {
    return {
      meta: [
        { name: 'theme-color', content: this.$store.getters.primary },
      ],
      title: (this.$store.getters['group/current'] || {}).name,
    }
  },
  async asyncData ({ params, store, error }) {
    if (!store.getters['group/current'])
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      return error({ icon: 'account-alert-outline', statusCode: 'Group not found', message: 'It seems to be a local group' })
    store.commit('group/clearUnreads', params.id)
    return { params }
  },
})
export default class GroupPage extends mixins(CommonMixin, NavigationMixin, GroupMixin) {
  fab = false
  tab_index = 0
  tab_id: string|null = 'summary'

  // Computed
  get tabItems () {
    return [
      {
        text: this.$t('ui.tabs.summary'),
        icon: 'script-text-outline',
        key: 'summary',
      }, {
        text: this.$t('ui.tabs.expenses'),
        icon: 'chart-pie',
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

  get speedDialShow () {
    return this.tab_index === 0
  }

  get fabStyle () {
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
  onTabIndexChanged () {
    this.tab_id = (this.tabItems[this.tab_index] || {}).key || null
  }

  @Watch('tab_id')
  onTabIdChanged () {
    const tab = this.tabItems.find(t => t.key === this.tab_id)
    this.tab_index = tab ? this.tabItems.indexOf(tab) : -1
  }
}
</script>

<style lang='sass'>
.group-page
  .v-bottom-navigation
    border-top: 1px solid rgba(125,125,125,0.3)

    & > .v-btn:before
      opacity: 0 !important
</style>
