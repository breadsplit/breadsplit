<template lang='pug'>
v-expansion-panel.date-grouping-list(v-model='value')
  v-expansion-panel-content(v-for='([date, items], index) in groups' :key='date' :expand-icon='expandIcon')
    template(v-slot:header)
      b.primary--text {{formatDate(date)}}
      div
      .append
        slot(name='header-append' :date='date' :items='items' :index='index' :active='index === value')

    slot(name='item' :date='date' :items='items' :index='index' :active='index === value')
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import groupBy from 'lodash/groupBy'
import dayjs from 'dayjs'
import { dateToRelative } from '~/core'

@Component
export default class DateGroupingList extends Vue {
  value = 0

  @Prop(Array) readonly data?: {timestamp: number}[]
  @Prop({ default: 'month' }) readonly groupBy!: 'day' | 'month' | 'year'
  @Prop(String) readonly expandIcon?: string

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
.date-grouping-list
  .v-expansion-panel__header
    display grid
    grid-template-columns max-content auto max-content max-content

    & > *
      display inline-block

  .v-expansion-panel
    box-shadow none
</style>
