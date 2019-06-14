<template lang='pug'>
v-card.balances
  v-subheader
    v-icon.mr-1 mdi-wallet
    span {{$t('ui.tabs.balances')}}
    v-spacer
    app-display-currency-switch

  v-list.pa-0
    template(v-for='(balance, index) in balances')
      v-divider(v-if='index!=0')
      v-list-tile(:key='balance.uid' avatar @click='gotoNewTransaction({from: balance.uid})')
        v-list-tile-avatar
          app-user-avatar(:id='balance.uid' size='38')
        v-list-tile-content
          app-user-info(:id='balance.uid')
        v-list-tile-action.pr-1
          v-list-tile-title.text-xs-right
            app-money-label(
              :amount='balance.balance'
              :currency='balance.currency'
              color
            )
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { GroupBalances } from '~/core'
import { GroupMixin, NavigationMixin } from '~/mixins'

@Component
export default class Balances extends mixins(GroupMixin, NavigationMixin) {
  get balances() {
    return GroupBalances(this.group)
  }
}
</script>
