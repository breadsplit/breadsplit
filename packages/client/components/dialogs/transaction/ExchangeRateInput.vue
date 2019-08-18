<template lang='pug'>
div.ml-2(v-columns='"40px auto max-content max-content"' v-if='from !== to' v-ripple='editing' @click='changeExchangeRate()')
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
  v-progress-circular(v-if='requesting' indeterminate color='grey' size='24' width='2.5').ma-3.op-50

  v-dialog(v-model='dialog' width='500px')
    v-card
      v-toolbar(color='transparent' flat)
        v-btn(icon @click='close()')
          v-icon mdi-close
        v-toolbar-title.primary--text {{$t('ui.exchanges.set_exchanges')}}

      .px-6.py-3
        .mb-6(v-columns='"auto max-content auto"')
          v-text-field(
            :value='fromFee'
            :label='from'
            disabled
            outlined hide-details
          )
          v-icon.mx-4 mdi-arrow-right
          v-text-field(
            :value='toFee'
            :label='to'
            @input='updateToFee'
            type='number'
            inputmode='numeric'
            pattern='[0-9]*'
            outlined hide-details
          )

        v-text-field(
          v-model:number='manualRate'
          :placeholder='`${rate} (${date})`'
          :label='$t("ui.exchanges.exchange")'
          type='number'
          inputmode='numeric'
          pattern='[0-9]*'
          outlined hide-details clearable
          @keydown.enter='enter()'
        )

      v-card-actions.pa-3
        v-spacer
        v-btn(color='grey' v-if='manualRate' depressed text @click='manualRate=null') {{$t('ui.exchanges.auto')}}
        v-btn(color='primary' depressed text @click='dialog=false') {{$t('ui.button_finish')}}
</template>

<script lang='ts'>
import { Component, Prop, mixins, Watch } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { FallbackExchangeRate } from '../../../../meta/fallback_exchange_rates'
import { Transaction } from '~/types'
import { GroupMixin } from '~/mixins'
import { getExchangeRateOn } from '~/core'

@Component
export default class ExchangeRateInput extends mixins(GroupMixin) {
  @Prop(Object) readonly form!: Transaction
  @Prop(Boolean) readonly editing!: boolean

  requesting = false
  dialog = false

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

  get manualRate () {
    if (this.form.exchange_rate_override)
      return this.form.exchange_rate_override.rate
    return null
  }

  set manualRate (value) {
    if (!value || isNaN(value)) {
      this.form.exchange_rate_override = undefined
    }
    else {
      this.$set(this.form, 'exchange_rate_override', {
        from: this.from,
        to: this.to,
        rate: value,
        date: dayjs().format('YYYY-MM-DD'),
      })
    }
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
    this.$set(this.form, 'exchange_rate', this.$fire.getExchangeRatesSync(this.form.timestamp))
  }

  async update () {
    this.requesting = true
    this.$set(this.form, 'exchange_rate', await this.$fire.getExchangeRates(this.form.timestamp))
    this.requesting = false
  }

  @Watch('form', { immediate: true })
  onCurrencyChanged () {
    if (!this.editing)
      return
    this.updateSync()
    this.update()
  }

  @Watch('form.timestamp')
  onTimestampChanged () {
    if (!this.editing)
      return
    this.update()
  }

  changeExchangeRate () {
    if (!this.editing)
      return
    this.dialog = true
  }

  updateToFee (value: number) {
    if (!value || isNaN(value))
      this.manualRate = null
    else if (!this.fromFee)
      this.manualRate = null
    else
      this.manualRate = value / this.fromFee
  }
}
</script>
