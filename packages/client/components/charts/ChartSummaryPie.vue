<template lang='pug'>
svg.chart-summary-pie(
  :width='fixed?width:undefined'
  :height='fixed?height:undefined'
  :viewBox='`0 0 ${width} ${height}`'
  preserveAspectRatio='xMidYMid meet'
)
</template>

<script lang='ts'>
import * as d3 from 'd3'
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'

@Component
export default class ChartSummaryPie extends Vue {
  @Prop({ default: 400 }) readonly width!: number
  @Prop({ default: 400 }) readonly height!: number
  @Prop({ default: false }) readonly fixed!: boolean
  @Prop({ default: 40 }) readonly margin!: number
  @Prop({ default: 1000 }) readonly duration!: number
  @Prop({ default: false }) readonly label!: boolean
  @Prop({ default: () => [] }) readonly value!: {name: string; value: number; color?: string}[]

  get radius () {
    return Math.min(this.width, this.height) / 2 - this.margin
  }

  svg: any
  pie: any
  arc: any
  outerArc: any
  _current: any

  mounted () {
    this.init()
    this.update()
  }

  init () {
    const svg = this.svg = d3.select(this.$el)
      .append('g')

    svg.append('g')
      .attr('class', 'slices')
    svg.append('g')
      .attr('class', 'labels')
    svg.append('g')
      .attr('class', 'lines')

    const width = this.width
    const height = this.height
    const radius = Math.min(width, height) / 2

    this.pie = d3.pie()
      .sort(null)
      .value((d: any) => {
        return d.value
      })

    this.arc = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4)

    this.outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    svg.attr('transform', `translate(${width / 2},${height / 2})`)
  }

  mergeWithFirstEqualZero (first, second) {
    const secondSet = d3.set()
    second.forEach((d) => { secondSet.add(d.id) })

    const onlyFirst = first
      .filter((d) => { return !secondSet.has(d.id) })
      .map((d) => { return { ...d, value: 0 } })

    return d3.merge([second, onlyFirst])
      .sort((a: any, b: any) => {
        return d3.ascending(a.value, b.value)
      })
  }

  @Watch('value', { deep: true })
  update () {
    this.change(this.value)
  }

  change (data: any[]) {
    const duration = this.duration
    const svg = this.svg
    const vm = this
    const key = d => d.data.id

    data = [{ id: 'none', color: '#ccc', value: data.length ? 0 : 1 }, ...data]

    let data0 = svg
      .select('.slices')
      .selectAll('path.slice')
      .data()
      .map(d => d.data)

    if (data0.length === 0)
      data0 = data

    const was = this.mergeWithFirstEqualZero(data, data0)
    const is = this.mergeWithFirstEqualZero(data0, data)

    /* ------- SLICE ARCS ------- */

    let slice = svg.select('.slices')
      .selectAll('path.slice')
      .data(this.pie(was), key)

    slice.enter()
      .insert('path')
      .attr('class', 'slice')
      .style('fill', d => d.data.color)
      .each(function (d) {
        // @ts-ignore
        this._current = d
      })

    slice = svg.select('.slices')
      .selectAll('path.slice')
      .data(this.pie(is), key)

    slice
      .transition()
      .duration(duration)
      .attrTween('d', function (d) {
        // @ts-ignore
        const interpolate = d3.interpolate(this._current, d)
        // @ts-ignore
        const _this = this
        return function (t) {
          _this._current = interpolate(t)
          return vm.arc(_this._current)
        }
      })

    slice = svg.select('.slices')
      .selectAll('path.slice')
      .data(this.pie(data), key)

    slice
      .exit()
      .transition()
      .delay(duration)
      .duration(0)
      .remove()

    if (!this.label)
      return

    /* ------- TEXT LABELS ------- */

    let text = svg.select('.labels')
      .selectAll('text')
      .data(this.pie(was), key)

    text.enter()
      .append('text')
      .attr('dy', '.35em')
      .style('opacity', 0)
      .text(d => d.data.name)
      .each(function (d) {
        // @ts-ignore
        this._current = d
      })

    function midAngle (d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2
    }

    text = svg.select('.labels')
      .selectAll('text')
      .data(this.pie(is), key)

    text.transition()
      .duration(duration)
      .style('opacity', (d) => {
        return d.data.value === 0 ? 0 : 1
      })
      .attrTween('transform', function (d) {
        // @ts-ignore
        const interpolate = d3.interpolate(this._current, d)
        // @ts-ignore
        const _this = this
        return function (t) {
          const d2 = interpolate(t)
          _this._current = d2
          const pos = vm.outerArc.centroid(d2)
          pos[0] = vm.radius * (midAngle(d2) < Math.PI ? 1 : -1)
          return `translate(${pos})`
        }
      })
      .styleTween('text-anchor', function (d) {
        // @ts-ignore
        const interpolate = d3.interpolate(this._current, d)
        return function (t) {
          const d2 = interpolate(t)
          return midAngle(d2) < Math.PI ? 'start' : 'end'
        }
      })

    text = svg.select('.labels')
      .selectAll('text')
      .data(this.pie(data), key)

    text
      .exit()
      .transition()
      .delay(duration)
      .remove()

    /* ------- SLICE TO TEXT POLYLINES ------- */

    let polyline = svg.select('.lines')
      .selectAll('polyline')
      .data(this.pie(was), key)

    polyline.enter()
      .append('polyline')
      .style('opacity', 0)
      .each(function (d) {
        // @ts-ignore
        this._current = d
      })

    polyline = svg.select('.lines')
      .selectAll('polyline')
      .data(this.pie(is), key)

    polyline.transition()
      .duration(duration)
      .style('opacity', (d) => {
        return d.data.value === 0 ? 0 : 0.5
      })
      .attrTween('points', function (d) {
        // @ts-ignore
        this._current = this._current
        // @ts-ignore
        const interpolate = d3.interpolate(this._current, d)
        // @ts-ignore
        const _this = this
        return function (t) {
          const d2 = interpolate(t)
          _this._current = d2
          const pos = vm.outerArc.centroid(d2)
          pos[0] = vm.radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1)
          return [vm.arc.centroid(d2), vm.outerArc.centroid(d2), pos]
        }
      })

    polyline = svg.select('.lines')
      .selectAll('polyline')
      .data(this.pie(data), key)

    polyline
      .exit()
      .transition()
      .delay(duration)
      .remove()
  }
}
</script>

<style lang='sass'>
svg.chart-summary-pie
  user-select: none

  path.slice
    stroke-width:2px

  polyline
    opacity: .3
    stroke: black
    stroke-width: 2px
    fill: none
</style>
