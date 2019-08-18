<template lang='pug'>
v-card.settle-up
  v-subheader
    v-icon.mr-1 mdi-account-supervisor-circle
    span {{$t('ui.tabs.settle_up')}}
    v-spacer
    v-icon.op-50.ml-2(@click='shareSettleUpReport()') mdi-share

  // app-chart-settle-up-solutions(:solutions='solutions')

  v-list.pa-0(flat)
    template(v-for='(solution, index) in solutions')
      v-list-item.relax-list-item(:key='solution.uid' @click='settleUp(solution)')
        i18n(path='ui.settle_up_solution').py-2.px-0
          span.text-no-wrap
            app-user-avatar.pa-1(:id='solution.from' size='24')
            app-user-info.pa-1(:id='solution.from' bold)
          span.text-no-wrap
            app-user-avatar.pa-1(:id='solution.to' size='24')
            app-user-info.pa-1(:id='solution.to' bold)
          app-money-label.text-bold(
            :amount='solution.amount'
            :currency='solution.currency'
          )
</template>

<script lang='ts'>
import { Component, mixins, Getter } from 'nuxt-property-decorator'
import { CommonMixin, NavigationMixin } from '~/mixins'
import { Solution } from '~/types'

@Component
export default class SettleUpSolutions extends mixins(NavigationMixin, CommonMixin) {
  @Getter('group/currentSolutions') readonly solutions!: Solution[]

  settleUp (solution: Solution) {
    this.gotoNewTransaction({
      type: 'transfer',
      from: solution.from,
      to: solution.to,
      amount: solution.amount,
      category: 'transfer',
    })
  }

  shareSettleUpReport () {
    this.WIP()
  }
}
</script>
