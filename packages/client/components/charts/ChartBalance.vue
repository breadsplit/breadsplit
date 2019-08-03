<!-- References
https://bl.ocks.org/sxywu/8192e134d310a91beeb433fa65c21c9f
http://bl.ocks.org/dbuezas/9572040
https://gist.github.com/Zhenmao/4a96cc5b296d9cfea270e5f20c60b222
<-->

<template lang='pug'>
svg.chart-balance(
  :width='fixed?width:undefined'
  :height='fixed?height:undefined'
  :viewBox='`0 0 ${width} ${height}`'
  preserveAspectRatio='xMidYMid meet'
)
</template>

<script lang='ts'>
import * as d3 from 'd3'
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { PlainBalance } from '~/types'

@Component
export default class ChartBalance extends Vue {
  @Prop({ default: 400 }) readonly width!: number
  @Prop({ default: 400 }) readonly height!: number
  @Prop({ default: false }) readonly fixed!: boolean
  @Prop({ default: 40 }) readonly marginX!: number
  @Prop({ default: 20 }) readonly marginY!: number
  @Prop({ default: 1000 }) readonly duration!: number
  @Prop({ default: 20 }) readonly barWidth!: number
  @Prop({ default: 5 }) readonly padding!: number
  @Prop({ default: true }) readonly label!: boolean
  @Prop({ default: () => [] }) readonly value!: PlainBalance[]

  get radius () {
    return Math.min(this.innerWidth, this.innerHeight) / 2
  }

  get innerWidth () {
    return this.width - 2 * this.marginX
  }

  get innerHeight () {
    return this.height - 2 * this.marginY
  }

  svg!: d3.Selection<Element, any, null, undefined>

  mounted () {
    this.init()
    this.update(this.value)
  }

  init () {
    this.svg = d3.select(this.$el)
  }

  @Watch('value', { deep: true })
  update (newValue: PlainBalance[], oldValue: PlainBalance[] = []) {
    this.change(newValue, oldValue)
  }

  change (data: PlainBalance[], oldData: PlainBalance[]) {
    const svg = this.svg
    const value = data.map(d => d.balance)
    const max = Math.max(...value)
    const min = Math.min(...value)

    const yScale = d3.scaleLinear()
      .domain([min, max])
      .range([this.height, 0])

    console.log(yScale)

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => this.marginX + i * (this.barWidth + this.padding))
      .attr('y', (d, i) => yScale(Math.max(0, d.balance)))
      .attr('height', d => Math.abs(yScale(0) - yScale(d.balance)))
      .attr('width', this.barWidth)
      .style('fill', 'grey')
      .style('opacity', (d, i) => { return 1 /* - (i * (1/data.length)); */ })
  }
}
</script>

<style lang='sass'>
svg.chart-balance
  user-select: none
  overflow: visible
</style>
