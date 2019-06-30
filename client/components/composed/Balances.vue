<template lang='pug'>
v-card.balances
  v-subheader
    v-icon.mr-1 mdi-wallet
    span {{$t('ui.tabs.balances')}}
    v-spacer
    app-display-currency-switch

  v-list.pa-0
    template(v-for='(balance, index) in balances')
      v-list-item(:key='balance.uid' @click='gotoNewTransaction({from: balance.uid})')
        v-list-item-avatar
          app-user-avatar(:id='balance.uid' size='38')
        v-list-item-content
          app-user-info(:id='balance.uid')
        v-list-item-action.pr-1
          v-list-item-title.text-xs-right
            app-money-label(
              :amount='balance.balance'
              :currency='balance.currency'
              color
            )
</template>

<script lang='ts'>
import { Component, mixins, Getter } from 'nuxt-property-decorator'
import { NavigationMixin } from '~/mixins'
import { Balance } from '~/types'

@Component
export default class Balances extends mixins(NavigationMixin) {
  @Getter('group/currentBalances') readonly balances!: Balance[]
}
</script>
