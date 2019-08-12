<template lang='pug'>
.data-range-select
  div(v-columns='"max-content auto max-content"').px-3
    v-btn.my-auto(@click='previous' icon small :disabled='unit === "custom" || unit === "all"')
      v-icon mdi-chevron-left

    div
      h2.px-3.primary--text.mb-n1 {{display}}
      v-expand-transition
        .op-75(v-show='unit !== "all" && unit !== "day"') {{subdisplay}}

      v-btn-toggle.mt-2(v-model='internal_unit' rounded mandatory )
        v-btn(small) {{$t('date_range.day.display')}}
        v-btn(small) {{$t('date_range.week.display')}}
        v-btn(small) {{$t('date_range.month.display')}}
        v-btn(small) {{$t('date_range.year.display')}}
        v-btn(small) {{$t('date_range.all.display')}}
        v-btn(small) {{$t('date_range.custom.display')}}

    v-btn.my-auto(@click='next' icon small :disabled='unit === "custom" || unit === "all"')
      v-icon mdi-chevron-right
</template>

<script lang='ts'>
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { getWeekOfYear, shortDate, shortDateMonth } from '~/../utils/formatters'
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
      return this.$t('date_range.custom.full_display')

    const today = dayjs().startOf(this.unit)
    const diff = this.dateFrom.diff(today, this.unit)
    if (diff === -1 && this.$t(`date_range.${this.unit}.last`))
      return this.$t(`date_range.${this.unit}.last`)
    if (diff === 0 && this.$t(`date_range.${this.unit}.this`))
      return this.$t(`date_range.${this.unit}.this`)
    if (diff === 1 && this.$t(`date_range.${this.unit}.next`))
      return this.$t(`date_range.${this.unit}.next`)

    if (this.unit === 'week')
      return this.$t('date_range.week.formatter', [getWeekOfYear(this.dateFrom)])

    if (this.unit === 'month')
      return shortDateMonth(this.$i18n.locale, this.dateFrom)

    return shortDate(this.$i18n.locale, this.dateFrom)
  }

  get subdisplay () {
    const to = this.dateTo.subtract(1, 'minute')
    return `${shortDate(this.$i18n.locale, this.dateFrom, this.dateFrom)} - ${shortDate(this.$i18n.locale, to, to)}`
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

<style lang="sass">
.data-range-select
  .v-item-group
    .v-btn
      min-width: 0
      padding: 0 10px
      text-transform: none
      &:first-child
        padding-left: 14px
      &:last-child
        padding-right: 14px
        margin-right: 0
      .v-btn__content
        line-height: inherit
      &.v-btn--active
        background-color: var(--theme-primary) !important
        color: #fff
        z-index: 2
        border-color: transparent !important
</style>
