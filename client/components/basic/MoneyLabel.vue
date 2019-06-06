<template lang='pug'>
span.money-label(:class='balanceColorClass') {{formatted}}
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { numberToMoney } from '~/core'

@Component({
  name: 'MoneyLabel',
})
export default class MoneyLabel extends Vue {
  /**
   * The amount of money
   */
  @Prop({ default: 0 }) readonly amount!: number
  /**
   * Currency code
   */
  @Prop(String) readonly currency?: string
  /**
   * Should change color based on value
   */
  @Prop(Boolean) readonly color?: boolean
  /**
   * Override global locale
   */
  @Prop(String) readonly locale?: string

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
    const locale = this.locale || this.$store.getters.locale
    return numberToMoney(this.amount, locale, currency)
  }
}
</script>

<style lang='stylus'>
.money-label
  font-size 0.95em
</style>
