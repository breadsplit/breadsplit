<template lang='pug'>
v-list-item.transaction-item(@click='navigate()' v-show='!involved || involvedFee !== 0')
  v-list-item-avatar
    app-category-icon.mx-2.my-1(
      :category='transaction.category'
      :text='false'
      :size='38'
      :group='group'
    )
  v-list-item-content
    v-list-item-title {{desc}}
    v-list-item-subtitle.sub-label {{datetime}}

  v-list-item-action.pr-1.text-right(v-if='involved' v-rows='"auto max-content"')
    template(v-if='involveMode === "debt"')
      .involved-note(v-if='involvedFee >= 0') {{$t('ui.transactions.involved_positive', [getUserName(involved)])}}
      .involved-note(v-else) {{$t('ui.transactions.involved_negative', [getUserName(involved)])}}
    template(v-else)
      .involved-note {{$t('ui.transactions.involved_expensed', [getUserName(involved)])}}
    app-money-label(
      :amount='involvedFee'
      :currency='transaction.currency'
      color
    )

  v-list-item-action.pr-1.text-right(v-else v-rows='"auto max-content"')
    app-money-label(
      :amount='-transaction.total_fee'
      :currency='transaction.currency'
      color
    )
    .creators-debtors
      app-avatars-horizontal-group(:ids='creditor_ids' size='24' max-length='3')
      v-icon(size='20') mdi-arrow-right
      app-avatars-horizontal-group(:ids='debtor_ids' size='24' max-length='3')
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { UserInfoMixin, NavigationMixin, CommonMixin, GroupMixin } from '~/mixins'
import { Transaction } from '~/types'
import { dateFromNow } from '~/../utils/formatters'
import { TransactionBalanceChanges } from '~/core'

@Component
export default class TransactionItem extends mixins(UserInfoMixin, GroupMixin, NavigationMixin, CommonMixin) {
  @Prop(Object) readonly transaction!: Transaction
  @Prop(String) readonly involved?: string
  @Prop({ default: 'debt' }) readonly involveMode!: 'debt' | 'expense'

  get creditor_ids () {
    return this.transaction.creditors.filter(c => c.weight).map(c => c.uid)
  }

  get debtor_ids () {
    return this.transaction.debtors.filter(c => c.weight).map(c => c.uid)
  }

  get involvedBalance () {
    if (!this.involved)
      return
    return TransactionBalanceChanges(this.transaction).find(i => i.uid === this.involved)
  }

  get involvedFee () {
    if (!this.involvedBalance)
      return 0
    if (this.involveMode === 'debt')
      return +this.involvedBalance.balance || 0
    else
      return +this.involvedBalance.debt || 0
  }

  get datetime () {
    return dateFromNow(this.transaction.timestamp, this.currentLocale)
  }

  get desc () {
    return this.transaction.desc || this.$t('noun.expense')
  }

  navigate () {
    this.gotoTransaction(this.transaction.id)
  }
}
</script>

<style lang='sass'>
.transaction-item
  .creators-debtors
    .v-icon
      opacity: 0.4
      vertical-align: middle

  .involved-note
    opacity: 0.7
    font-size: 0.9em
</style>
