<template lang='pug'>
v-menu(offset-y left v-if='group && currencies.length > 1')
  template(v-slot:activator='{ on }')
    v-btn(icon text v-on='on' style='width:inherit;').px-2
      span.pr-1.op-75 {{displayCurrency}}
      v-icon.op-50 mdi-swap-horizontal-bold
  v-list
    v-list-item(v-for='(item, index) in currencies', :key='item', @click='changeDisplayingCurrency(item)')
      v-list-item-title {{item}}
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { GroupMixin } from '~/mixins'

@Component
export default class DisplayCurrencySwitch extends mixins(GroupMixin) {
  changeDisplayingCurrency (currency: string) {
    this.displayCurrency = currency
  }
}
</script>
