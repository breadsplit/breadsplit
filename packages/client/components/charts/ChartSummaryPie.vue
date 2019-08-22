<!-- References
https://bl.ocks.org/sxywu/8192e134d310a91beeb433fa65c21c9f
http://bl.ocks.org/dbuezas/9572040
https://gist.github.com/Zhenmao/4a96cc5b296d9cfea270e5f20c60b222
<-->

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
  @Prop({ default: 40 }) readonly marginX!: number
  @Prop({ default: 20 }) readonly marginY!: number
  @Prop({ default: 1000 }) readonly duration!: number
  @Prop({ default: true }) readonly label!: boolean
  @Prop({ default: () => [] }) readonly value!: Item[]

  get radius () {
    return Math.min(this.innerWidth, this.innerHeight) / 2
  }

  get innerWidth () {
    return this.width - 2 * this.marginX
  }

  get innerHeight () {
    return this.height - 2 * this.marginY
  }

  svg!: d3.Selection<SVGElement, any, null, undefined>
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

    const radius = this.radius

    this.pie = d3.pie<Item>()
      .sort(null)
      .value(d => d.value)

    this.arc = d3.arc<any, d3.PieArcDatum<Item>>()
      .outerRadius(radius * 0.9)
      .innerRadius(radius * 0.5)

    this.outerArc = d3.arc<any, d3.PieArcDatum<Item>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    svg.attr('transform', `translate(${this.width / 2},${this.height / 2})`)
  }

  mergeWithFirstEqualZero (first: Item[], second: Item[]): Item[] {
    const secondSet = d3.set()
    second.forEach(d => secondSet.add(d.id))

    const onlyFirst = first
      .filter(d => !secondSet.has(d.id))
      .map(d => ({ ...d, value: 0 }))

    return d3.merge<Item>([second, onlyFirst])
      .sort((a, b) => d3.ascending(a.id, b.id))
  }

  onGraphClicked (id) {
    this.$emit('click:id', id)
  }

  @Watch('value', { deep: true })
  update (newValue: Item[], oldValue: Item[] = []) {
    this.change(newValue, oldValue)
  }

  change (data: Item[], oldData: Item[]) {
    const duration = this.duration
    const svg = this.svg
    const key = d => d.data.id

    data = [{ id: 'none', color: '#ccc', value: data.length ? 0 : 1, label: '' }, ...data]
    oldData = [{ id: 'none', color: '#ccc', value: oldData.length ? 0 : 1, label: '' }, ...oldData]

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
      .on('click', d => this.onGraphClicked(d.data.id))

    slice = svg.select('.slices')
      .selectAll('path.slice')
      .data(isDatum, key)

    slice
      .transition()
      .duration(duration)
      .attrTween('d', (d, i) => {
        const current = wasDatum[d.index]
        const interpolate = d3.interpolate(current, d)
        return t => this.arc(interpolate(t)) || ''
      })

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
      .data(wasDatum, key)

    text.enter()
      .append('text')
      .attr('dy', '.35em')
      .style('opacity', 0)
      .style('fill', d => d.data.color)
      .text(d => d.data.label)

    function midAngle (d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2
    }

    text = svg.select('.labels')
      .selectAll('text')
      .data(isDatum, key)

    text.transition()
      .duration(duration)
      .style('opacity', d => this.shouldLabelShown(d) ? 1 : 0)
      .attrTween('transform', (d) => {
        const current = wasDatum[d.index]
        const interpolate = d3.interpolate(current, d)
        return (t) => {
          const d2 = interpolate(t)
          const pos = this.outerArc.centroid(d2)
          pos[0] = (this.innerWidth / 2) * (midAngle(d2) < Math.PI ? 1 : -1)
          return `translate(${pos})`
        }
      })
      .styleTween('text-anchor', (d) => {
        const current = wasDatum[d.index]
        const interpolate = d3.interpolate(current, d)
        return (t) => {
          const d2 = interpolate(t)
          return midAngle(d2) < Math.PI ? 'start' : 'end'
        }
      })

    text
      .exit()
      .transition()
      .delay(duration)
      .remove()

    /* ------- SLICE TO TEXT POLYLINES ------- */

    let polyline = svg.select('.lines')
      .selectAll('polyline')
      .data(wasDatum, key)

    polyline.enter()
      .append('polyline')
      .style('opacity', 0)

    polyline = svg.select('.lines')
      .selectAll('polyline')
      .data(isDatum, key)

    polyline.transition()
      .duration(duration)
      .style('opacity', d => this.shouldLabelShown(d) ? 0.5 : 0)
      // @ts-ignore
      .attrTween('points', (d) => {
        const current = wasDatum[d.index]
        const interpolate = d3.interpolate(current, d)
        return (t) => {
          const d2 = interpolate(t)
          const pos = this.outerArc.centroid(d2)
          pos[0] = this.radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1)
          return [this.arc.centroid(d2), this.outerArc.centroid(d2), pos]
        }
      })

    polyline
      .exit()
      .transition()
      .delay(duration)
      .remove()
  }

  shouldLabelShown (d: d3.PieArcDatum<Item>) {
    if (!d.data.value || !d.data.label)
      return false
    if (Math.abs(d.startAngle - d.endAngle) < 0.15)
      return false
    return true
  }
}
</script>

<style lang='sass'>
svg.chart-summary-pie
  user-select: none
  overflow: visible

  path.slice
    stroke-width: 2px
    transition: transform .15s ease-in-out

    &:hover
      transform: scale(1.07)

  polyline
    stroke: rgba(128,128,128,0.6)
    stroke-width: 2px
    fill: none
</style>
