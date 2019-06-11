<template lang='pug'>
v-expansion-panel(v-model='value')
  v-expansion-panel-content(v-for='([date, items], index) in groups')
    template(v-slot:header)
      b.primary--text {{formatDate(date)}}

    slot(name='item' :date='date' :items='items' :index='index')
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import groupBy from 'lodash/groupBy'
import dayjs from 'dayjs'
import { dateToRelative } from '~/core'

@Component
export default class ExpandableList extends Vue {
  value = 0

  @Prop(Array) readonly data?: {timestamp: number}[]
  @Prop({ default: 'month' }) readonly groupBy!: 'day' | 'month' | 'year'

  get groups() {
    if (!this.data)
      return []
    const entries = Object.entries(groupBy(this.data, t =>
      dayjs(t.timestamp).startOf(this.groupBy)
    ))
    entries.sort((a, b) => +dayjs(b[0]) - +dayjs(a[0]))
    for (const [, group] of entries)
      group.sort((a, b) => b.timestamp - a.timestamp)
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
