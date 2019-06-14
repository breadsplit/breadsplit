<template lang='pug'>
v-menu(offset-y left v-if='currencies.length > 1')
  template(v-slot:activator='{ on }')
    .vertical-aligned(v-on='on')
      span.pr-1.op-75(v-if='display_currency !== group.main_currency') {{display_currency}}
      v-icon.op-50 mdi-swap-horizontal-bold
  v-list
    v-list-tile(v-for='(item, index) in currencies', :key='item', @click='changeDisplayingCurrency(item)')
      v-list-tile-title {{item}}
</template>

<script lang='ts'>
import { Component, mixins, Getter } from 'nuxt-property-decorator'
import { GroupMixin } from '~/mixins'

@Component
export default class Balances extends mixins(GroupMixin) {
  @Getter('group/currentDisplayCurrency') readonly display_currency!: string

  changeDisplayingCurrency(currency: string) {
    this.$store.dispatch('group/changeDisplayCurrency', { display_currency: currency })
  }
}
</script>
