<template lang='pug'>
.money-label(:class='balanceColorClass')
  span.neg.mx-1(v-if='neg') -
  span.currency {{currencyDisplay}}
  span.fee.mr-1 {{abs.toFixed(2)}}
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'
import Currencies from '~/meta/currencies'

@Component
export default class MoneyLabel extends Vue {
  menu = false

  @Prop({ default: 0 }) readonly amount!: number
  @Prop(String) readonly currency?: string

  get balanceColorClass() {
    if (this.neg)
      return ['deep-orange--text', 'text--darken-2']
    else if (this.zero)
      return ['grey--text', 'text--lighten-1']
    else
      return 'green--text'
  }

  get currencyDisplay() {
    const c = Currencies.find(c => c.cc === this.currency)
    if (!c)
      return this.currency
    return c.symbol || c.cc || this.currency
  }

  get rounded() {
    return Math.round(this.amount * 100) / 100
  }

  get abs() {
    return Math.abs(this.rounded)
  }

  get neg() {
    return this.rounded < 0
  }

  get zero() {
    return this.rounded === 0
  }
}
</script>

<style lang='stylus'>
.money-label
  font-size 0.95em

  .neg
    font-weight bold
</style>
