<template lang='pug'>
div
  div
    app-money-label(:amount='fromFee' :currency='from')
    span.px-1 ≈
    app-money-label(:amount='toFee' :currency='to')
  div.op-50(style='margin-top:-4px') {{rate}}
</template>

<script lang='ts'>
import { Component, Prop, mixins, Watch } from 'nuxt-property-decorator'
import { Transaction } from '~/types'
import { GroupMixin } from '~/mixins'

@Component
export default class ExchangeRateInput extends mixins(GroupMixin) {
  @Prop(Object) readonly form!: Transaction

  rate: number|null = null

  get from() {
    return this.form.currency
  }

  get to() {
    return this.group.main_currency
  }

  get fromFee() {
    return this.form.total_fee
  }

  get toFee() {
    return this.fromFee * (this.rate || 1)
  }

  async update() {
    this.rate = await this.$fire.getExchangeRateOn(this.from, this.to) || null
  }

  @Watch('from', { immediate: true })
  @Watch('to', { immediate: true })
  onCurrencyChanged() {
    this.update()
  }
}
</script>
