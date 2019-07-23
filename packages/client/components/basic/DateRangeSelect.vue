<template lang='pug'>
.data-range-select
  h2
    v-btn(@click='previous' icon small)
      v-icon mdi-chevron-left
    span.px-3 {{display}}
    v-btn(@click='next' icon small)
      v-icon mdi-chevron-right
</template>

<script lang='ts'>
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { GroupMixin } from '~/mixins'

export type DateRangeUnit = 'month' | 'week' | 'year' | 'day' | 'custom'

@Component
export default class DateRangeSelect extends mixins(GroupMixin) {
  @Prop({ type: String, default: 'month' }) readonly unit!: DateRangeUnit
  @Prop({ type: Number, default: () => +new Date() }) readonly from!: number
  @Prop(Number) readonly to?: number

  internal_to: Date|null = null

  get dateFrom () {
    if (this.unit === 'custom')
      return dayjs(this.from).startOf('day')
    return dayjs(this.from).startOf(this.unit)
  }

  get dateTo () {
    if (this.unit === 'custom')
      return dayjs(this.internal_to || this.dateFrom).startOf('day')
    return this.dateFrom.add(1, this.unit)
  }

  get datePrevious () {
    if (this.unit === 'custom')
      return dayjs(this.internal_to || this.dateFrom).startOf('day')
    return this.dateFrom.subtract(1, this.unit)
  }

  get display () {
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

    return this.dateFrom.format((this.$t(`date_range.${this.unit}.formatter`) || '').toString())
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
}
</script>
