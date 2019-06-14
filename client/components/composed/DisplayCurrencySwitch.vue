<template lang='pug'>
v-menu(offset-y left v-if='currencies.length > 1')
  template(v-slot:activator='{ on }')
    v-icon.op-50(v-on='on') mdi-swap-horizontal-bold
  v-list
    v-list-tile(v-for='(item, index) in currencies', :key='item', @click='changeDisplayingCurrency(item)')
      v-list-tile-title {{item}}
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { GroupMixin } from '~/mixins'

@Component
export default class Balances extends mixins(GroupMixin) {
  changeDisplayingCurrency(currency: string) {
    this.$store.dispatch('group/changeDisplayCurrency', { display_currency: currency })
  }
}
</script>
