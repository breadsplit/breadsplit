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
import { numberToMoney } from '../../../utils'

@Component
export default class ChartSummaryPie extends Vue {
  @Prop({ default: 400 }) readonly width!: number
  @Prop({ default: 400 }) readonly height!: number
  @Prop({ default: false }) readonly fixed!: boolean
  @Prop({ default: 40 }) readonly margin!: number
  @Prop({ default: () => [] }) readonly value!: {name: string; value: number; color?: string}[]

  get svg () {
    return d3.select(this.$el)
  }

  get radius () {
    return Math.min(this.width, this.height) / 2 - this.margin
  }

  chartLayer: any
  arc: any
  pie: any

  async mounted () {
    const margin = this.margin
    const chartWidth = this.width - (margin * 2)
    const chartHeight = this.height - (margin * 2)

    this.chartLayer = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${margin}, ${margin})`
      )

    this.arc = d3.arc()
      .outerRadius(chartHeight / 2)
      .innerRadius(chartHeight / 4)

    this.pie = this.chartLayer
      .append('g')
      .attr(
        'transform',
        `translate(${chartWidth / 2}, ${chartHeight / 2})`
      )

    this.drawChart()
  }

  @Watch('value', { deep: true })
  drawChart () {
    const data = this.value
    const total = this.value.map(v => v.value).reduce((a, b) => a + b, 0)
    const threshold = 0.08

    console.log('redraw', total)

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

    const arcs = d3.pie()
      .sort(null)
      // @ts-ignore
      .value((d) => { return d.value })(data)

    const block = this.pie.selectAll('.arc')
      .data(arcs)

    block.select('path').attr('d', this.arc)

    const newBlock = block
      .enter()
      .append('g')
      .classed('arc', true)

    newBlock.append('path')
      .attr('d', this.arc)
      .attr('id', (d, i) => { return `arc-${i}` })
      // @ts-ignore
      .attr('fill', d => d.data.color || color(d.data.name))

    newBlock.append('text')
      .attr('dx', 10)
      .attr('dy', -5)
      .append('textPath')
      .attr('fill', d => d.data.color || color(d.data.name))
      .attr('xlink:href', (d, i) => { return `#arc-${i}` })
      .text((d) => {
        if ((d.data.value / total) < threshold)
          return ''
        return d.data.name
      })

    newBlock.append('text')
      .attr('dx', 10)
      .attr('dy', 20)
      .append('textPath')
      .attr('xlink:href', (d, i) => { return `#arc-${i}` })
      .attr('fill', 'white')
      .attr('style', 'opacity: 0.8')
      .text((d) => {
        if ((d.data.value / total) < threshold)
          return ''
        return numberToMoney(d.data.value, this.$i18n.locale)
      })
  }
}
</script>

<style lang='sass'>
svg.chart-summary-pie
  user-select: none
</style>
