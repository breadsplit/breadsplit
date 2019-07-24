<template lang='pug'>
.data-range-select
  h1.pb-2
    v-btn(@click='previous' icon small v-if='unit !== "custom" && unit !== "all"')
      v-icon mdi-chevron-left
    span.px-3 {{display}}
    v-btn(@click='next' icon small v-if='unit !== "custom" && unit !== "all"')
      v-icon mdi-chevron-right

  v-btn-toggle(v-model='internal_unit' rounded mandatory )
    v-btn(small) {{$t('date_range.day.display')}}
    v-btn(small) {{$t('date_range.week.display')}}
    v-btn(small) {{$t('date_range.month.display')}}
    v-btn(small) {{$t('date_range.year.display')}}
    v-btn(small) {{$t('date_range.all.display')}}
    v-btn(small) {{$t('date_range.custom.display')}}
</template>

<script lang='ts'>
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { getWeekOfYear } from '~/../utils/formatters'
import { GroupMixin } from '~/mixins'

export type DateRangeUnit = 'month' | 'week' | 'year' | 'day' | 'custom' | 'all'

const MAX_DATE = 8640000000000000
const MIN_DATE = -8640000000000000

const units = [
  'day',
  'week',
  'month',
  'year',
  'all',
  'custom',
]

@Component
export default class DateRangeSelect extends mixins(GroupMixin) {
  @Prop({ type: String, default: 'month' }) readonly unit!: DateRangeUnit
  @Prop({ type: Number, default: () => +new Date() }) readonly from!: number
  @Prop(Number) readonly to?: number

  internal_to: Date|null = null

  get internal_unit () {
    return units.indexOf(this.unit)
  }

  set internal_unit (v: number) {
    this.$emit('update:unit', units[v])
  }

  get dateFrom () {
    if (this.unit === 'all')
      return dayjs(MIN_DATE)
    if (this.unit === 'custom')
      return dayjs(this.from).startOf('day')
    return dayjs(this.from).startOf(this.unit)
  }

  get dateTo () {
    if (this.unit === 'all')
      return dayjs(MAX_DATE)
    if (this.unit === 'custom')
      return dayjs(this.internal_to || this.dateFrom).startOf('day')
    return this.dateFrom.add(1, this.unit)
  }

  get datePrevious () {
    if (this.unit === 'all' || this.unit === 'custom')
      return this.dateFrom
    return this.dateFrom.subtract(1, this.unit)
  }

  get display () {
    if (this.unit === 'all')
      return this.$t('date_range.all.full_display')

    if (this.unit === 'custom')
      return `${this.dateFrom.format('ll')} - ${this.dateTo.format('ll')}`

    const today = dayjs().startOf(this.unit)
    const diff = this.dateFrom.diff(today, this.unit)
    if (diff === -1 && this.$t(`date_range.${this.unit}.last`))
      return this.$t(`date_range.${this.unit}.last`)
    if (diff === 0 && this.$t(`date_range.${this.unit}.this`))
      return this.$t(`date_range.${this.unit}.this`)
    if (diff === 1 && this.$t(`date_range.${this.unit}.next`))
      return this.$t(`date_range.${this.unit}.next`)

    if (this.unit === 'week')
      return `${this.$t('date_range.week.formatter', [getWeekOfYear(this.dateFrom)])} (${this.dateFrom.format('ll')} - ${this.dateTo.format('ll')})`

    return this.dateFrom.format((this.$t(`date_range.${this.unit}.formatter`) || '').toString())
  }

  changeUnit (unit: string) {
    this.$emit('update:unit', unit)
  }

  next () {
    this.$emit('update:from', +this.dateTo)
  }

  previous () {
    this.$emit('update:from', +this.datePrevious)
  }

  update () {
    this.$emit('update:from', +this.dateFrom)
    this.$emit('update:to', +this.dateTo)
  }

  @Watch('from', { immediate: true })
  onFromChanged (newVal, oldVal) {
    if (newVal !== oldVal)
      this.update()
  }

  @Watch('unit')
  onUnitChanged () {
    this.$emit('update:from', +new Date())
  }
}
</script>
