<template lang='pug'>
v-card.settle-up
  v-subheader {{$t('ui.tabs.settle_up')}}

  app-chart-settle-up-solutions(:solutions='solutions')

  v-list.pa-0(two-line)
    template(v-for='(solution, index) in solutions')
      v-divider(v-if='index!=0')
      v-list-tile(:key='solution.uid', avatar, @click='WIP')
        v-list-tile-content(v-columns='"1fr 1fr 1fr"' style='align-items:center').py-2.px-0
          div.text-xs-right.text-no-wrap
            app-user-info.pa-3(v-if='!isMobile' :id='solution.from')
            app-user-avatar(:id='solution.from')
          div(v-rows='"1fr 1fr"').text-xs-center.px-3
            app-money-label(:amount='solution.amount' :currency='solution.currency')
            v-icon mdi-ray-start-arrow
          div.text-no-wrap
            app-user-avatar(:id='solution.to')
            app-user-info.pa-3(v-if='!isMobile' :id='solution.to')
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { GroupBalances, SettleUp } from '~/core'
import { GroupMixin, CommonMixin } from '~/mixins'

@Component
export default class SettleUpSolutions extends mixins(GroupMixin, CommonMixin) {
  get balances() {
    return GroupBalances(this.group)
  }

  get solutions() {
    return SettleUp(this.balances)
  }
}
</script>
