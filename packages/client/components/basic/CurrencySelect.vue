<template lang='pug'>
v-select.currency-select(
  v-bind='$attrs'
  :value='value'
  @input='onInput'
  :class='{flat: mini}'
  :items='items'
  :prepend-icon='mini ? "" : "mdi-currency-usd"'
  :label='mini ? "" : $t("ui.currency")'
  hide-details
)
</template>

<script lang='ts'>
import { Component, Vue, Prop, Getter } from 'nuxt-property-decorator'
import { getLocaleCurrencies, getCommonCurrencyCodes } from '~/../meta/currencies'

@Component({
  inheritAttrs: false,
})
export default class CurrencySelect extends Vue {
  @Prop(String) readonly value!: string
  @Prop(Boolean) readonly mini?: boolean
  @Prop({ default: () => [] }) readonly codes!: string[]
  @Prop({ default: 4 }) readonly limit!: number

  @Getter('locale') locale!: string

  private get currencies() {
    const set = new Set([this.value, ...this.codes, ...getCommonCurrencyCodes(this.locale)])
    const codes = Array.from(set).splice(0, this.limit)
    return getLocaleCurrencies(this.locale, codes)
  }

  get items() {
    let items: (string|object)[]
    if (this.mini)
      items = this.currencies.map(c => c.cc)
    else
      items = this.currencies.map(c => ({ text: `${c.cc} - ${c.name} (${c.symbol})`, value: c.cc }))
    items.push({
      text: this.$t('ui.more_currency').toString(),
      value: null,
    })
    return items
  }

  async onInput(v: string|null) {
    if (v) {
      this.$emit('input', v)
    }
    else {
      const result = await this.$currency.select()
      if (result)
        this.$emit('input', result)
      else
        this.$emit('input', this.currencies[0].cc)
    }
  }
}
</script>
