<template lang='pug'>
v-card.transactions
  v-subheader {{$t('ui.tabs.transactions')}}
  v-list.pa-0(three-line)
    template(v-for='(trans, index) in displayedTransactions')
      v-divider(v-if='index!=0')
      v-list-tile(:key='trans.id', avatar, @click='gotoTransaction(trans.id)')
        v-list-tile-avatar.ma-2
          app-category-icon.mx-2.my-1(:category='trans.category', :text='false', :size='48')
        v-list-tile-content
          v-list-tile-title {{trans.desc || $t('noun.expense')}}
          v-list-tile-sub-title
            i18n(path='ui.paid_by_xx')
              b {{trans.creditor_names.join(', ')}}
          v-list-tile-sub-title.time-label {{dateFromNow(trans.timestamp)}}
        v-list-tile-action.pr-1(v-rows='"auto max-content"')
          app-money-label.text-xs-right(:amount='-trans.total_fee' :currency='trans.currency')
          .creators-debtors
            .creators
              app-user-avatar(v-for='c in trans.creditor_ids' :id='c' :key='c' size='24')
            v-icon(size='20') mdi-arrow-right
            .debtors
              app-user-avatar(v-for='d in trans.debtor_ids' :id='d' :key='d' size='24')

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
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { GroupMixin, UserInfoMixin, NavigationMixin } from '~/mixins'
import { Transaction } from '~/types'
import { dateFromNow } from '~/core'

@Component
export default class Transactions extends mixins(GroupMixin, UserInfoMixin, NavigationMixin) {
  collapsed = true

  @Prop({ default: 10 }) readonly max!: number

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
      return this.transactions.slice(0, this.max)
    return this.transactions
  }

  get needShowMore() {
    return this.collapsed && this.amount > this.max
  }

  get needCollapsed() {
    return !this.collapsed && this.amount > this.max
  }

  dateFromNow=dateFromNow

  parseTrans(trans: Transaction) {
    const creditor_ids = trans.creditors.filter(c => c.weight).map(c => c.uid)
    const debtor_ids = trans.debtors.filter(c => c.weight).map(c => c.uid)
    const creditor_names = creditor_ids.map(id => this.getUserName(id))

    return {
      ...trans,
      creditor_ids,
      debtor_ids,
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

.creators-debtors
  & > *
    display inline-block
    vertical-align middle

  .v-icon
    opacity 0.4

  .user-avatar:not(:first-child)
    margin-left -8px

  .v-avatar
    .theme--light & img
      border 2px solid #fff
    .theme--dark & img
      border 2px solid #424242
</style>
