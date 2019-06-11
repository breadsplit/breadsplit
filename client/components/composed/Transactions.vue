<template lang='pug'>
v-card.transactions
  v-subheader
    v-icon.mr-1 mdi-script-text-outline
    span {{$t('ui.tabs.transactions')}}

  app-transactions-list(:transactions='displayedTransactions')
    template(v-slot:append)
      template(v-if='needShowMore')
        v-divider
        .text-xs-center
          v-btn(flat small fluid color='primary' @click='collapsed=false') Show all

      // TODO: remove false to enable if need
      template(v-if='needCollapsed && false')
        v-divider
        .text-xs-center
          v-btn(flat small fluid color='primary' @click='collapsed=true') Collapse
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { GroupMixin, UserInfoMixin, NavigationMixin } from '~/mixins'

@Component
export default class Transactions extends mixins(GroupMixin, UserInfoMixin, NavigationMixin) {
  collapsed = true

  @Prop({ default: 10 }) readonly max!: number

  get transactions() {
    return this.group.transactions
      .map(i => i)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  get amount() {
    return this.transactions.length
  }

  get displayedTransactions() {
    if (this.collapsed)
      return this.transactions.slice(0, this.max)
    return this.transactions
  }

  get needShowMore() {
    return this.collapsed && this.amount > this.max
  }

  get needCollapsed() {
    return !this.collapsed && this.amount > this.max
  }
}
</script>

<style lang='stylus'>
.transactions
  .time-label
    font-size 0.8em
    opacity 0.8
</style>
