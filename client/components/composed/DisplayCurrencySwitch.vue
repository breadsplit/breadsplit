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
import { GroupMixin, CommonMixin } from '~/mixins'

@Component
export default class Balances extends mixins(GroupMixin, CommonMixin) {
  changeDisplayingCurrency(currency: string) {
    this.WIP()
  }
}
</script>
