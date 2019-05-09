<template lang='pug'>
v-card.balances
  v-subheader {{$t('ui.tabs.balances')}}
  v-list.pa-0(two-line)
    template(v-for='(balance, index) in balances')
      v-divider(v-if='index!=0')
      v-list-tile(:key='balance.id', avatar, @click='')
        v-list-tile-avatar.ma-1
          app-user-avatar(:id='balance.memberId')
        v-list-tile-content
          v-list-tile-title
            app-user-info(:id='balance.memberId')
        v-list-tile-action.pr-1
          v-list-tile-title
            app-money-label(:amount='balance.balance[group.currencies[0]]', :currency='group.currencies[0]')
</template>

<script lang='ts'>
import GroupMixin from '~/mixins/group'
import { Component, Mixins } from 'vue-property-decorator'
import { GroupBalances } from '~/utils/core'
import MemberMixin from '../mixins/member'

@Component
export default class Balances extends Mixins(GroupMixin, MemberMixin) {
  get balances() {
    return GroupBalances(this.group)
  }
}
</script>
