<template lang='pug'>
v-list-item.transaction-item(@click='navigate()')
  v-list-item-avatar
    app-category-icon.mx-2.my-1(
      :category='transaction.category'
      :text='false', :size='38'
    )
  v-list-item-content
    v-list-item-title {{desc}}
    v-list-item-subtitle.sub-label {{datetime}}

  v-list-item-action.pr-1.text-xs-right(v-rows='"auto max-content"')
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
import { UserInfoMixin, NavigationMixin, CommonMixin } from '~/mixins'
import { Transaction } from '~/types'
import { dateFromNow } from '~/../utils/formatters'

@Component
export default class TransactionItem extends mixins(UserInfoMixin, NavigationMixin, CommonMixin) {
  @Prop(Object) readonly transaction!: Transaction

  get creditor_ids() {
    return this.transaction.creditors.filter(c => c.weight).map(c => c.uid)
  }

  get debtor_ids() {
    return this.transaction.debtors.filter(c => c.weight).map(c => c.uid)
  }

  get datetime() {
    return dateFromNow(this.transaction.timestamp, this.currentLocale)
  }

  get desc() {
    return this.transaction.desc || this.$t('noun.expense')
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
</style>
