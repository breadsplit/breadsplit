<template lang='pug'>
v-list-item.transaction-item(
  @click='navigate()'
  :ripple='false'
)
  v-list-item-avatar
    v-icon.mx-auto.my-1(
      :color='category.color'
      :size='38'
    ) mdi-{{category.icon}}

  v-list-item-content
    v-list-item-title
      span {{desc}}
      template(v-if='transaction.attached_images && transaction.attached_images.length')
        v-icon.ml-1.op-40(size='20') mdi-image-outline
      template(v-if='transaction.note')
        v-icon.ml-1.op-40(size='20') mdi-comment-processing-outline
    v-list-item-subtitle.sub-label {{datetime}}

  v-list-item-action.pr-1.text-right(v-if='involved' v-rows='"auto max-content"')
    template(v-if='involveMode === "debt"')
      .involved-note(v-if='involvedFee >= 0') {{$t('ui.transactions.involved_positive', [getUserName(involved)])}}
      .involved-note(v-else) {{$t('ui.transactions.involved_negative', [getUserName(involved)])}}

    template(v-else)
      .involved-note {{$t('ui.transactions.involved_expensed', [getUserName(involved)])}}

    app-money-label-with-exchange(
      :amount='involvedFee'
      :transaction='transaction'
      :target='displayCurrency'
      color
    )

  v-list-item-action.pr-1.text-right(v-else v-rows='"auto max-content"')
    app-money-label-with-exchange(
      :amount='-transaction.total_fee'
      :transaction='transaction'
      :target='displayCurrency'
      color
    )
    .creators-debtors
      app-avatars-horizontal-group(:ids='creditor_ids' size='24' max-length='3')
      template(v-if='involved_ids.length > 1')
        v-icon(size='20') mdi-arrow-right
        app-avatars-horizontal-group(:ids='debtor_ids' size='24' max-length='3')
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import uniq from 'lodash/uniq'
import { TransactionHelper } from '../../../core'
import { UserInfoMixin, NavigationMixin, CommonMixin, GroupMixin } from '~/mixins'
import { Transaction } from '~/types'
import { dateFromNow } from '~/utils'

@Component
export default class TransactionItem extends mixins(UserInfoMixin, GroupMixin, NavigationMixin, CommonMixin) {
  @Prop(Object) readonly transaction!: Transaction
  @Prop(String) readonly involved?: string
  @Prop({ default: 'debt' }) readonly involveMode!: 'debt' | 'expense'

  get creditor_ids() {
    return this.transaction.creditors.filter(c => c.weight).map(c => c.uid)
  }

  get debtor_ids() {
    return this.transaction.debtors.filter(c => c.weight).map(c => c.uid)
  }

  get involved_ids() {
    return uniq([...this.creditor_ids, ...this.debtor_ids])
  }

  get involvedBalance() {
    if (!this.involved)
      return
    return TransactionHelper.from(this.transaction).balanceChangesOf(this.involved)
  }

  get involvedFee() {
    if (!this.involvedBalance)
      return 0
    if (this.involveMode === 'debt')
      return +this.involvedBalance.balance || 0
    else
      return -this.involvedBalance.debt || 0
  }

  get datetime() {
    return dateFromNow(this.transaction.timestamp, this.currentLocale)
  }

  get category() {
    return this.parseCategory(this.transaction.category)
  }

  get hasDesc() {
    return !!this.transaction.desc
  }

  get desc() {
    return this.transaction.desc || this.category.text || this.$t('noun.expense')
  }

  navigate() {
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

  .sub-label
    opacity: 0.6
    font-size: 0.9em
</style>
