<template lang="pug">
v-simple-table.transcation-sheet
  thead
    th.text-center {{$t('ui.transactions.header_members')}}
    th.text-center {{$t('ui.transactions.header_credit')}}
    th.text-center {{$t('ui.transactions.header_debit')}}
  tbody
    tr(v-for='i in items')
      td
        app-user-avatar.py-1.px-2(:id='i.uid' size='24')
        app-user-info(:id='i.uid')
      td.text-right
        app-money-label(:amount='i.credit' :currency='transaction.currency' color)
      td.text-right
        app-money-label(:amount='i.debit' :currency='transaction.currency' color)
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { Transaction } from '~/types'
import { GroupMixin } from '~/mixins'
import { TransactionWeightsHelper } from '~/core'

@Component
export default class TransactionSheet extends mixins(GroupMixin) {
  @Prop(Object) readonly transaction!: Transaction
  @Prop(Boolean) readonly hideEmpty?: boolean

  get items() {
    const creditors = new TransactionWeightsHelper(this.transaction, 'creditors')
    const debtors = new TransactionWeightsHelper(this.transaction, 'debtors')
    const dict: Record<string, {uid: string; credit: number; debit: number}> = {}
    creditors.participators
      .forEach((p) => {
        if (!dict[p.uid])
          dict[p.uid] = { credit: creditors.getFee(p), uid: p.uid, debit: 0 }
        else
          dict[p.uid].credit = creditors.getFee(p)
      })
    debtors.participators
      .forEach((p) => {
        if (!dict[p.uid])
          dict[p.uid] = { debit: -debtors.getFee(p), uid: p.uid, credit: 0 }
        else
          dict[p.uid].debit = -debtors.getFee(p)
      })
    let items = Object.values(dict)
    if (this.hideEmpty)
      items = items.filter(i => i.credit || i.debit)
    return items
  }
}
</script>

<style lang="sass">
.transcation-sheet
  th
    font-size: 0.9em
  tr
    border-bottom: none !important
</style>
