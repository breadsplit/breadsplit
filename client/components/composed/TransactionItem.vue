<template lang='pug'>
v-list-tile.transaction-item(avatar, @click='navigate()')
  v-list-tile-avatar
    app-category-icon.mx-2.my-1(
      :category='transaction.category'
      :text='false', :size='38'
    )
  v-list-tile-content
    v-list-tile-title {{desc}}
    v-list-tile-sub-title.time-label {{datetime}}
  v-list-tile-action.pr-1(v-rows='"auto max-content"')
    app-money-label.text-xs-right(
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
import { UserInfoMixin, NavigationMixin } from '~/mixins'
import { Transaction } from '~/types'
import { dateFromNow } from '~/core'

@Component
export default class TransactionItem extends mixins(UserInfoMixin, NavigationMixin) {
  @Prop(Object) readonly transaction!: Transaction

  get creditor_ids() {
    return this.transaction.creditors.filter(c => c.weight).map(c => c.uid)
  }

  get debtor_ids() {
    return this.transaction.debtors.filter(c => c.weight).map(c => c.uid)
  }

  get datetime() {
    return dateFromNow(this.transaction.timestamp)
  }

  get desc() {
    return this.transaction.desc || this.$t('noun.expense')
  }

  navigate() {
    this.gotoTransaction(this.transaction.id)
  }
}
</script>

<style lang='stylus'>
.transaction-item
  .time-label
    font-size 0.8em
    opacity 0.8

  .creators-debtors
    .v-icon
      opacity 0.4
      vertical-align middle
</style>
