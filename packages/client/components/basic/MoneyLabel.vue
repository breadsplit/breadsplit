<template lang='pug'>
span.money-label(:class='balanceColorClass') {{prefix}}{{formatted}}{{suffix}}
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { numberToMoney } from '~/utils'

@Component
export default class MoneyLabel extends Vue {
  @Prop({ default: 0 }) readonly amount!: number
  @Prop(String) readonly currency?: string
  @Prop({ default: '' }) readonly prefix!: string
  @Prop({ default: '' }) readonly suffix!: string
  @Prop(Boolean) readonly color?: boolean

  get roundedAmount () {
    return Math.round(+this.amount * 100) / 100
  }

  get balanceColorClass () {
    if (!this.color)
      return []
    if (this.roundedAmount < 0)
      return ['deep-orange--text', 'text--darken-2']
    else if (this.roundedAmount > 0)
      return ['green--text']
    else
      return ['grey--text', 'text--lighten-1']
  }

  get formatted () {
    if (this.roundedAmount === 0)
      return '-'
    const currency = this.currency
    const locale = this.$store.getters.locale
    return numberToMoney(this.amount, locale, currency)
  }
}
</script>
