<template lang='pug'>
.money-label(:class='balanceColorClass')
  span.neg.mx-1(v-if='neg') -
  span.currency {{currencyDisplay}}
  span.fee.mr-1 {{format}}
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'
import Currencies from '~/meta/currencies'
import getcur from 'locale-currency'

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
    return c.cc || this.currency
  }

  get abs() {
    return Math.abs(this.amount)
  }

  get format() {
    const currency = getcur.getCurrency(this.$store.getters.locale)
    const f_num = new Intl.NumberFormat(this.$store.getters.locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(this.abs)

    return f_num
  }

  get neg() {
    return this.amount < 0
  }

  get zero() {
    return this.amount === 0
  }
}
</script>

<style lang='stylus'>
.money-label
  font-size 0.95em

  .neg
    font-weight bold
</style>
