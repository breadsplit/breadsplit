<template lang='pug'>
.money-label(:class='balanceColorClass').text-xs-right
  span.fee.mr-1 {{formatted}}
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class MoneyLabel extends Vue {
  @Prop({ default: 0 }) readonly amount!: number
  @Prop(String) readonly currency?: string

  get balanceColorClass() {
    if (this.neg)
      return ['deep-orange--text', 'text--darken-2']
    else if (this.zero)
      return ['grey--text', 'text--lighten-1']
    else
      return ['green--text']
  }

  get formatted() {
    if (this.zero)
      return '-'
    const currency = this.currency
    const locale = this.$store.getters.locale
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    })
    return formatter.format(this.amount)
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
</style>
