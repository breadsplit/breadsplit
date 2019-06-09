<template lang='pug'>
v-card.settle-up
  v-subheader
    v-icon.mr-1 mdi-account-supervisor-circle
    span {{$t('ui.tabs.settle_up')}}
    v-spacer
    v-icon.op-50(@click='shareSettleUpReport()') mdi-share

  // app-chart-settle-up-solutions(:solutions='solutions')

  v-list.pa-0
    template(v-for='(solution, index) in solutions')
      v-divider(v-if='index!=0')
      v-list-tile.relax-list-item(:key='solution.uid' @click='settleUp(solution)')
        i18n.py-2.px-0(path='ui.settle_up_solution')
          span.text-no-wrap
            app-user-avatar.pa-1(:id='solution.from' size='24')
            app-user-info.pa-1(:id='solution.from' bold)
          span.text-no-wrap
            app-user-avatar.pa-1(:id='solution.to' size='24')
            app-user-info.pa-1(:id='solution.to' bold)
          app-money-label(
            :amount='solution.amount'
            :currency='solution.currency'
            color
          )
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { GroupBalances, SettleUp } from '~/core'
import { GroupMixin, CommonMixin, NavigationMixin } from '~/mixins'
import { Solution } from '~/types'

@Component
export default class SettleUpSolutions extends mixins(GroupMixin, NavigationMixin, CommonMixin) {
  get balances() {
    return GroupBalances(this.group)
  }

  get solutions() {
    return SettleUp(this.balances, this.group)
  }

  settleUp(solution: Solution) {
    this.gotoNewTransaction({
      type: 'transfer',
      from: solution.from,
      to: solution.to,
      amount: solution.amount,
    })
  }

  shareSettleUpReport() {
    this.WIP()
  }
}
</script>
