<template lang='pug'>
v-card.balances
  v-subheader {{$t('ui.tabs.balances')}}
  v-list.pa-0(two-line)
    template(v-for='(balance, index) in balances')
      v-divider(v-if='index!=0')
      v-list-tile(:key='balance.uid', avatar, @click='gotoNewTransaction({uid: balance.uid})')
        v-list-tile-avatar.ma-1
          app-user-avatar(:id='balance.uid')
        v-list-tile-content
          v-list-tile-title
            app-user-info(:id='balance.uid')
        v-list-tile-action.pr-1
          v-list-tile-title
            app-money-label(:amount='balance.balance[group.currencies[0]]', :currency='group.currencies[0]')
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import { GroupBalances } from '~/core'
import { GroupMixin, NavigationMixin } from '~/mixins'

@Component
export default class Balances extends Mixins(GroupMixin, NavigationMixin) {
  get balances() {
    return GroupBalances(this.group)
  }
}
</script>
