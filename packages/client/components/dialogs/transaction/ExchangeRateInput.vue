<template lang='pug'>
div.ml-2(v-columns='"40px auto"' v-if='from !== to' v-ripple='editing' @click='changeExchangeRate()')
  v-icon(color='grey') mdi-swap-horizontal-bold
  v-subheader
    div
      div
        span.pr-1 {{$t('ui.exchanges.exchange')}}
        app-money-label(:amount='fromFee' :currency='from')
        span.px-1 ≈
        app-money-label(:amount='toFee' :currency='to')
      template(v-if='source === "manual"')
        div.op-50(style='margin-top:-4px') {{rate}} {{$t('ui.exchanges.manually_set')}}
      template(v-else)
        div.op-50(style='margin-top:-4px') {{rate}} ({{date}})
</template>

<script lang='ts'>
import { Component, Prop, mixins, Watch } from 'nuxt-property-decorator'
import { FallbackExchangeRate } from '../../../../meta/fallback_exchange_rates'
import { Transaction } from '~/types'
import { GroupMixin } from '~/mixins'
import { getExchangeRateOn } from '~/core'

@Component
export default class ExchangeRateInput extends mixins(GroupMixin) {
  @Prop(Object) readonly form!: Transaction
  @Prop(Boolean) readonly editing!: boolean

  requesting = false

  get from () {
    return this.form.currency
  }

  get to () {
    return this.group.main_currency
  }

  get fromFee () {
    return this.form.total_fee
  }

  get info (): { rate: number; date: string; source: 'manual' | 'system' | 'fallback' } {
    if (this.form.exchange_rate_override)
      return { source: 'manual', ...this.form.exchange_rate_override }
    if (this.form.exchange_rate)
      return { source: 'system', ...getExchangeRateOn(this.from, this.to, this.form.exchange_rate) }
    else
      return { source: 'fallback', ...getExchangeRateOn(this.from, this.to, FallbackExchangeRate) }
  }

  get source () {
    return this.info.source
  }

  get date () {
    return this.info.date
  }

  get rate () {
    return this.info.rate
  }

  get toFee () {
    return this.fromFee * this.rate
  }

  updateSync () {
    if (!this.editing)
      return
    this.form.exchange_rate = this.$fire.getExchangeRatesSync(this.form.timestamp)
  }

  async update () {
    if (!this.editing)
      return
    this.requesting = true
    this.form.exchange_rate = await this.$fire.getExchangeRates(this.form.timestamp)
    this.requesting = false
  }

  @Watch('form', { immediate: true })
  onCurrencyChanged () {
    this.updateSync()
    this.update()
  }

  @Watch('form.timestamp')
  onTimestampChanged () {
    this.update()
  }

  changeExchangeRate () {
    // TODO:
  }
}
</script>
