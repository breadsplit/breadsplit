<template lang='pug'>
v-card
  v-subheader {{$t('ui.splitting.split_by')}}
  v-layout

  v-tabs(v-model='tab', slider-color='transparent' grow)
    v-tab(key='1' :class='tab == 0 ? "primary--text" : ""')
      v-icon(style='color:inherit;transition:none;').mr-1 mdi-account-multiple
      v-expand-x-transition
        span(v-show='tab === 0') {{$t('ui.splitting.average')}}
    v-tab(key='2' :class='tab == 1 ? "primary--text" : ""')
      v-icon(style='color:inherit;transition:none;').mr-1 mdi-currency-usd
      v-expand-x-transition
        span(v-show='tab === 1') {{$t('ui.splitting.amount')}}
    v-tab(key='3' :class='tab == 2 ? "primary--text" : ""')
      v-icon(style='color:inherit;transition:none;').mr-1 mdi-percent
      v-expand-x-transition
        span(v-show='tab === 2') {{$t('ui.splitting.percent')}}
    v-tab(key='4' :class='tab == 3 ? "primary--text" : ""')
      v-icon(style='color:inherit;transition:none;').mr-1 mdi-scale-balance
      v-expand-x-transition
        span(v-show='tab === 3') {{$t('ui.splitting.weight')}}

    v-tab-item(v-for='n in 4', :key='n')
      v-list(subheader
      ).pb-1
        template(v-for='(i,idx) in balanceChanges')
          v-divider
          v-list-tile
            v-list-tile-action(style='min-width: 40px')
              app-user-avatar(:id='i.memberId', size='30')
            v-list-tile-content
              v-list-tile-title
                app-user-info(:id='i.memberId', field='name')
            v-list-tile-content
              v-list-tile-title.text-xs-right.pr-3
                app-money-label(:amount='i.balance', :currency='trans.currency')
            v-list-tile-action
              v-text-field(
                type='number' style='width:50px'
                flat hide-details reverse
                v-model.number='trans.debtors.find(d=>d.memberId===i.memberId).weight')
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TransactionBalanceChanges } from '~/utils/core'
import { Transaction } from '~/types/models'

type Splitmode = 'average' | 'amount' | 'percent' | 'weight'

@Component
export default class Splitting extends Vue {
  tab = 0
  get splitmode(): Splitmode {
    switch (this.tab) {
      case 0:
        return 'average'
      case 1:
        return 'amount'
      case 2:
        return 'percent'
      default:
        return 'weight'
    }
  }

  @Prop(Object) readonly trans!: Transaction

  get balanceChanges() {
    return TransactionBalanceChanges(this.trans)
  }
}
</script>
