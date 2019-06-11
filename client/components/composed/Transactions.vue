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

  v-expansion-panel(v-else, :value='0')
    v-expansion-panel-content(v-for='([date, transactions], index) in groups')
      template(v-slot:header)
        b.primary--text {{formatDate(date)}}

      app-transactions-list(:transactions='transactions')
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { GroupMixin, UserInfoMixin, NavigationMixin } from '~/mixins'
import groupBy from 'lodash/groupBy'
import dayjs from 'dayjs'
import { dateToRelative } from '~/core'

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

  get groups() {
    const entries = Object.entries(groupBy(this.group.transactions, t =>
      dayjs(t.timestamp).startOf(this.groupBy)
    ))
    entries.sort((a, b) => +dayjs(b[0]) - +dayjs(a[0]))
    return entries
  }

  formatDate(date: dayjs.ConfigType) {
    if (this.groupBy === 'day')
      return dateToRelative(date)

    const d = dayjs(date)
    if (this.groupBy === 'year')
      return d.year()
    if (this.groupBy === 'month')
      return d.format('MMM')

    return d
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
