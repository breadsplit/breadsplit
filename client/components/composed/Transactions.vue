<template lang='pug'>
v-card.transactions
  v-subheader {{$t('ui.tabs.transactions')}}
  v-list.pa-0(three-line)
    template(v-for='(trans, index) in displayedTransactions')
      v-divider(v-if='index!=0')
      v-list-tile(:key='trans.id', avatar, @click='')
        v-list-tile-avatar.ma-2
          app-category-icon.mx-2.my-1(:category='trans.category', :text='false', :size='48')
        v-list-tile-content
          v-list-tile-title {{trans.desc || 'Expense'}}
          v-list-tile-sub-title Paid by {{trans.creditor_names.join(', ')}}
          v-list-tile-sub-title.time-label {{$dt(trans.timestamp).fromNow()}}
        v-list-tile-action.pr-1
          v-list-tile-title
            app-money-label(:amount='-trans.total_fee' :currency='trans.currency')

    template(v-if='needShowMore')
      v-divider
      .text-xs-center
        v-btn(flat small fluid color='primary' @click='collapsed=false') Show all

    // TODO: remove false to enable if need
    template(v-if='needCollapsed && false')
      v-divider
      .text-xs-center
        v-btn(flat small fluid color='primary' @click='collapsed=true') Collapse

</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import GroupMixin from '~/mixins/group'
import UserInfoMixin from '~/mixins/userinfo'

@Component
export default class Transactions extends Mixins(GroupMixin, UserInfoMixin) {
  collapsed = true
  collapsed_amount = 3

  get transactions() {
    return this.group.transactions
      .map(t => this.parseTrans(t))
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  get amount() {
    return this.transactions.length
  }

  get displayedTransactions() {
    if (this.collapsed)
      return this.transactions.slice(0, this.collapsed_amount)
    return this.transactions
  }

  get needShowMore() {
    return this.collapsed && this.amount > this.collapsed_amount
  }

  get needCollapsed() {
    return !this.collapsed && this.amount > this.collapsed_amount
  }

  parseTrans(trans) {
    const creditor_ids = trans.creditors.map(c => c.memberId)
    const creditor_names = creditor_ids.map(id => this.getUserName(id))

    return {
      ...trans,
      creditor_ids,
      creditor_names,
    }
  }
}
</script>

<style lang='stylus'>
.transactions
  .time-label
    font-size 0.8em
    opacity 0.8
</style>
