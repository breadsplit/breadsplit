<template lang='pug'>
span.money-label(:class='balanceColorClass') {{formatted}}
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { numberToMoney } from '~/core'

@Component
export default class MoneyLabel extends Vue {
  @Prop({ default: 0 }) readonly amount!: number
  @Prop(String) readonly currency?: string
  @Prop(Boolean) readonly color?: boolean

  get balanceColorClass() {
    if (!this.color)
      return []
    if (this.amount < 0)
      return ['deep-orange--text', 'text--darken-2']
    else if (this.amount > 0)
      return ['green--text']
    else
      return ['grey--text', 'text--lighten-1']
  }

  get formatted() {
    if (this.amount === 0)
      return '-'
    const currency = this.currency
    const locale = this.$store.getters.locale
    return numberToMoney(this.amount, locale, currency)
  }
}
</script>
