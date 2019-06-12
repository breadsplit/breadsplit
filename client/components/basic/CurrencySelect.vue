<template lang='pug'>
span
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
  app-currency-select-dialog(ref='dialog')
</template>

<script lang='ts'>
import { Component, Vue, Prop, Getter } from 'nuxt-property-decorator'
import { getLocaleCurrencies, getCommonCurrencyCodes } from '~/../meta/currencies'
import uniq from 'lodash/uniq'
import concat from 'lodash/concat'
import CurrencySelectDialog from './CurrencySelectDialog.vue'

@Component({
  inheritAttrs: false,
})
export default class CurrencySelect extends Vue {
  @Prop(String) readonly value!: string
  @Prop(Boolean) readonly mini?: boolean

  @Getter('locale') locale!: string

  customCodes: string[] = []

  $refs!: {
    dialog: CurrencySelectDialog
  }

  get codes() {
    // TODO: get recent locales based on group history
    const common = getCommonCurrencyCodes(this.locale)
    const codes = uniq(concat(this.customCodes, common))
    return codes.slice(0, 4)
  }

  get currencies() {
    return getLocaleCurrencies(this.locale, this.codes)
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
      const result = await this.$refs.dialog.open()
      if (result) {
        this.customCodes.unshift(result)
        this.$emit('input', result)
      }
      else {
        this.$emit('input', this.codes[0])
      }
    }
  }
}
</script>
