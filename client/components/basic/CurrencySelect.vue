<template lang='pug'>
v-select.flat(
  :value='value'
  @input='i=>$emit("input", i)'
  :items='currencies'
  hide-details
)
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import currencies from '~/../meta/currencies'

@Component
export default class CurrencySelect extends Vue {
  @Prop(String) readonly value!: string

  get currencies() {
    return currencies.map(c => c.cc)
  }
}
</script>
