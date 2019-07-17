<template lang='pug'>
v-expansion-panels.date-grouping-list(v-model='value' accordion)
  v-expansion-panel(v-for='([date, items], index) in groups' :key='date' :expand-icon='expandIcon')
    v-expansion-panel-header
      .content
        b.primary--text {{formatDate(date)}}
        div
        .append
          slot(name='header-append' :date='date' :items='items' :index='index' :active='index === value')

    v-expansion-panel-content
      slot(name='item' :date='date' :items='items' :index='index' :active='index === value')
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import groupBy from 'lodash/groupBy'
import dayjs from 'dayjs'
import { dateToRelative } from '~/../utils/formatters'

@Component
export default class DateGroupingList extends Vue {
  value = 0

  @Prop(Array) readonly data?: {timestamp: number}[]
  @Prop({ default: 'month' }) readonly groupBy!: 'day' | 'month' | 'year'
  @Prop(String) readonly expandIcon?: string

  get groups () {
    if (!this.data)
      return []
    const entries = Object.entries(groupBy(this.data.filter(i => i.timestamp), t =>
      dayjs(t.timestamp).startOf(this.groupBy)
    ))
    entries.sort((a, b) => +dayjs(b[0]) - +dayjs(a[0]))
    for (const [, group] of entries)
      group.sort((a, b) => b.timestamp - a.timestamp)
    return entries
  }

  formatDate (date: dayjs.ConfigType) {
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

<style lang='sass'>
.date-grouping-list
  .v-expansion-panel-header > .content
    display: grid
    grid-template-columns: max-content auto max-content max-content

    & > *
      display: inline-block

  .v-expansion-panel::before
    box-shadow: none

  .v-expansion-panel-content__wrap
    padding: 0
</style>
