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
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import Fraction from 'fraction.js'
import { Transaction } from '~/types'
import { ExchangeInTransaction } from '~/core'

@Component
export default class MoneyLabelWithExchange extends Vue {
  @Prop({ default: 0 }) readonly amount!: number
  @Prop(String) readonly target!: string
  @Prop(Boolean) readonly color?: boolean
  @Prop(Object) readonly transaction!: Transaction

  get targetAmount () {
    if (this.target === this.source)
      return this.amount
    const { value } = ExchangeInTransaction(this.transaction, new Fraction(this.amount), this.target)
    return +value
  }

  get source () {
    return this.transaction.currency
  }
}
</script>
