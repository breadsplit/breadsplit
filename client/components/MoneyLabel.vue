<template lang="pug">
.money-label(:class='balanceColorClass')
  span.fee.mr-1 {{amount.toFixed(2)}}
  span.currency {{currency}}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class MoneyLabel extends Vue {
  menu = false

  @Prop({ default: 0.0 }) readonly amount!: number
  @Prop(String) readonly currency?: string

  get balanceColorClass() {
    if (this.amount >= 0)
      return 'green--text'
    else
      return ['deep-orange--text', 'text--darken-2']
  }
}
</script>

<style lang="stylus">
.money-label
  font-size 0.95em
</style>
