<template lang="pug">
v-card.transactions
  v-subheader Transactions
  v-list.pa-0(three-line)
    template(v-for='(trans, index) in transactions')
      v-divider(v-if='index!=0')
      v-list-tile(:key='trans.id', avatar, @click='')
        v-list-tile-avatar.ma-2
          app-avatar(:id='trans.creditor_ids[0]')
        v-list-tile-content
          v-list-tile-title {{trans.desc || 'Expense'}}
          v-list-tile-sub-title Paid by {{trans.creditor_names.join(', ')}}
          v-list-tile-sub-title {{$dt(trans.timestamp).fromNow()}}
        v-list-tile-action.pr-1
          v-list-tile-title
            app-money-label(:amount='trans.total_fee' :currency='trans.currency')

  //p {{transactions}}
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import GroupMixin from '~/mixins/group'
import MemberMixin from '../mixins/member'

@Component
export default class Index extends Mixins(GroupMixin, MemberMixin) {
  get transactions() {
    return this.group.transactions.map(t => this.parseTrans(t))
  }

  parseTrans(trans) {
    const creditor_ids = trans.creditors.map(c => c.memberId)
    const creditor_names = creditor_ids.map(id => this.getMemberFromId({ id }).name)

    return {
      ...trans,
      creditor_ids,
      creditor_names,
    }
  }
}
</script>
