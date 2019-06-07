<template lang='pug'>
v-select(
  :value='value'
  @input='i=>$emit("input", i)'
  :class='{flat: mini}'
  :items='items'
  :prepend-icon='!mini && "mdi-currency-usd"'
  :label='!mini && $t("ui.currency")'
  hide-details
)
</template>

<script lang='ts'>
import { Component, Vue, Prop, Getter } from 'nuxt-property-decorator'
import { getLocaleCurrencies, getCommonCurrencyCodes } from '~/../meta/currencies'

@Component
export default class CurrencySelect extends Vue {
  @Prop(String) readonly value!: string
  @Prop(Boolean) readonly mini?: boolean

  @Getter('locale') locale!: string

  get codes() {
    // TODO: get recent locales based on group history
    return getCommonCurrencyCodes(this.locale)
  }

  get currencies() {
    return getLocaleCurrencies(this.locale, this.codes)
  }

  get items() {
    if (this.mini)
      return this.currencies.map(c => c.cc)
    else
      return this.currencies.map(c => ({ text: `${c.cc} - ${c.name} (${c.symbol})`, value: c.cc }))
  }
}
</script>
