<template lang='pug'>
div.ml-2(v-columns='"40px auto"' v-if='form !== to' v-ripple @click='changeExchangeRate()')
  v-icon(color='grey') mdi-swap-horizontal-bold
  v-subheader
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
import { oc } from 'ts-optchain'

@Component
export default class ExchangeRateInput extends mixins(GroupMixin) {
  @Prop(Object) readonly form!: Transaction

  info: {rate: number; date: string}|null = null
  override: number|null = null

  get from() {
    return this.form.currency
  }

  get to() {
    return this.group.main_currency
  }

  get fromFee() {
    return this.form.total_fee
  }

  get rate(): number {
    return this.override || oc(this).info.rate(1)
  }

  get toFee() {
    return this.fromFee * this.rate
  }

  async update() {
    this.info = await this.$fire.getExchangeRateOn(this.from, this.to, this.form.timestamp) || null
  }

  @Watch('from')
  @Watch('to')
  @Watch('form', { immediate: true })
  onCurrencyChanged() {
    this.info = null
    this.update()
  }

  @Watch('form.timestamp')
  onTimestampChanged() {
    this.update()
  }

  changeExchangeRate() {
    // TODO:
  }

  save() {
    if (!this.info && !this.override)
      return
    if (!this.form.exchanges)
      this.form.exchanges = []
    let record = this.form.exchanges.find(e => e.from === this.from && e.to === this.to)
    if (!record) {
      record = {
        from: this.from,
        to: this.to,
        rate: this.rate,
        date: oc(this.info).date(),
        source: this.override ? 'manual' : 'system',
      }
      this.form.exchanges.push(record)
      return
    }
    record.rate = this.rate
    record.date = oc(this.info).date()
    record.source = this.override ? 'manual' : 'system'
  }
}
</script>
