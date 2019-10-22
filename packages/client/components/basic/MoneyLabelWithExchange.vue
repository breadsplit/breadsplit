<template lang='pug'>
span
  template(v-if='target !== source')
    app-money-label(
      :amount='amount'
      :currency='source'
      :color='color'
      style='font-size:0.85em;border-bottom: 1px dotted;'
    ).mr-2.op-50
  app-money-label(
    :amount='targetAmount'
    :currency='target'
    :color='color'
  )
</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import Fraction from 'fraction.js'
import { Transaction } from '~/types'
import { ExchangeInTransaction } from '~/core'
import { GroupMixin } from '~/mixins'

@Component
export default class MoneyLabelWithExchange extends mixins(GroupMixin) {
  @Prop({ default: 0 }) readonly amount!: number
  @Prop(String) readonly target!: string
  @Prop(Boolean) readonly color?: boolean
  @Prop(Object) readonly transaction!: Transaction

  get exchanges () {
    return ExchangeInTransaction(this.transaction, new Fraction(this.amount), this.target, this.group.exchange_rates)
  }

  get targetAmount () {
    if (this.target === this.source)
      return this.amount
    return +this.exchanges.value
  }

  get source () {
    return this.transaction.currency
  }
}
</script>
