<template lang='pug'>
v-card.balances
  v-subheader
    v-icon.mr-1 mdi-wallet
    span {{$t('ui.tabs.balances')}}
    v-spacer
    app-display-currency-switch

  chart-balance(:value='plainBalance' :height='200')

  v-divider

  v-list.pa-0(flat)
    template(v-for='(balance, index) in balances')
      v-list-item(:key='balance.uid' @click='gotoNewTransaction({from: balance.uid})')
        v-list-item-avatar
          app-user-avatar(:id='balance.uid' size='38')
        v-list-item-content
          app-user-info(:id='balance.uid')
        v-list-item-action.pr-1
          v-list-item-title.text-right
            app-money-label(
              :amount='balance.balance'
              :currency='balance.currency'
              color
            )
</template>

<script lang='ts'>
import { Component, mixins, Getter } from 'nuxt-property-decorator'
import ChartBalance from '../charts/ChartBalance.vue'
import { NavigationMixin } from '~/mixins'
import { Balance, PlainBalance } from '~/types'

@Component({
  components: {
    ChartBalance,
  },
})
export default class Balances extends mixins(NavigationMixin) {
  @Getter('group/currentBalances') readonly balances!: Balance[]

  get plainBalance (): PlainBalance[] {
    return this.balances.map(b => ({ ...b, balance: +b.balance }))
  }
}
</script>
