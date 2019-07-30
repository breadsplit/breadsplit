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

export interface Item {
  id: string
  label: string
  color: string
  value: number
}

@Component
export default class ChartSummaryPie extends Vue {
  @Prop({ default: 400 }) readonly width!: number
  @Prop({ default: 400 }) readonly height!: number
  @Prop({ default: false }) readonly fixed!: boolean
  @Prop({ default: 40 }) readonly margin!: number
  @Prop({ default: 1000 }) readonly duration!: number
  @Prop({ default: false }) readonly label!: boolean
  @Prop({ default: () => [] }) readonly value!: Item[]

  get radius () {
    return Math.min(this.width, this.height) / 2 - this.margin
  }

  svg!: d3.Selection<SVGElement, {}, null, undefined>
  pie!: d3.Pie<any, Item>
  arc!: d3.Arc<any, d3.PieArcDatum<Item>>
  outerArc!: d3.Arc<any, d3.PieArcDatum<Item>>

  mounted () {
    this.init()
    this.update(this.value)
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

    this.pie = d3.pie<Item>()
      .sort(null)
      .value(d => d.value)

    this.arc = d3.arc<any, d3.PieArcDatum<Item>>()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4)

    this.outerArc = d3.arc<any, d3.PieArcDatum<Item>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    svg.attr('transform', `translate(${width / 2},${height / 2})`)
  }

  mergeWithFirstEqualZero (first: Item[], second: Item[]): Item[] {
    const secondSet = d3.set()
    second.forEach(d => secondSet.add(d.id))

    const onlyFirst = first
      .filter(d => !secondSet.has(d.id))
      .map(d => ({ ...d, value: 0 }))

    return d3.merge<Item>([second, onlyFirst])
      .sort((a, b) => d3.ascending(a.value, b.value))
  }

  @Watch('value', { deep: true })
  update (newValue: Item[], oldValue: Item[] = []) {
    this.change(newValue, oldValue)
  }

  change (data: Item[], oldData: Item[]) {
    const duration = this.duration
    const svg = this.svg
    const vm = this
    const key = d => d.data.id

    data = [{ id: 'none', color: '#ccc', value: data.length ? 0 : 1, label: '' }, ...data]

    if (oldData.length === 0)
      oldData = data

    const was = this.mergeWithFirstEqualZero(data, oldData)
    const is = this.mergeWithFirstEqualZero(oldData, data)

    const wasDatum = this.pie(was)
    const isDatum = this.pie(is)

    /* ------- SLICE ARCS ------- */

    let slice = svg.select('.slices')
      .selectAll('path.slice')
      .data(wasDatum, key)

    slice.enter()
      .insert('path')
      .attr('class', 'slice')
      .style('fill', d => d.data.color)
      /* .each(function (d) {
        // @ts-ignore
        this._current = d
      }) */

    slice = svg.select('.slices')
      .selectAll('path.slice')
      .data(isDatum, key)

    slice
      .transition()
      .duration(duration)
      .attrTween('d', (d, i) => {
        let current = wasDatum[i]
        const interpolate = d3.interpolate(current, d)
        return (t) => {
          current = interpolate(t)
          return this.arc(current) || ''
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
      .text(d => d.data.label)
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
          // @ts-ignore
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
      // @ts-ignore
      .attrTween('points', function (d) {
        // @ts-ignore
        this._current = this._current
        // @ts-ignore
        const interpolate = d3.interpolate(this._current, d)
        // @ts-ignore
        const _this = this
        return function (t) {
          const d2 = interpolate(t)
          // @ts-ignore
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
