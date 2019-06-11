<template lang='pug'>
v-card.transactions
  v-subheader
    v-icon.mr-1 mdi-script-text-outline
    span {{$t('ui.tabs.transactions')}}

  app-transactions-list(v-if='flat' :transactions='limitted')
    template(v-slot:append v-if='needShowMore')
      v-divider
      .text-xs-center
        v-btn(flat small fluid color='primary' @click='$emit("show-all")') Show all

  app-expandable-list(v-else :data='transactions')
    template(v-slot:item='{items, index, date}')
      app-transactions-list(:transactions='items' :key='date')
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { GroupMixin, UserInfoMixin, NavigationMixin } from '~/mixins'

@Component
export default class Transactions extends mixins(GroupMixin, UserInfoMixin, NavigationMixin) {
  collapsed = true
  groupBy: 'day' | 'month' | 'year' = 'month'

  @Prop({ default: 3 }) readonly limit!: number
  @Prop(Boolean) readonly flat?: boolean

  get transactions() {
    return this.group.transactions
      .map(i => i)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  get amount() {
    return this.transactions.length
  }

  get limitted() {
    if (this.collapsed)
      return this.transactions.slice(0, this.limit)
    return this.transactions
  }

  get needShowMore() {
    return this.collapsed && this.amount > this.limit
  }
}
</script>

<style lang='stylus'>
.transactions
  .time-label
    font-size 0.8em
    opacity 0.8

  .v-expansion-panel
    box-shadow none
</style>
