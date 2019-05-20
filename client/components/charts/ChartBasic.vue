<template lang='pug'>
.chart-basic
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import {
  select,
  scaleLinear,
  axisLeft,
  axisTop,
  max,
  line,
  extent,
} from 'd3'

const data = [99, 71, 78, 25, 36, 92]

@Component
export default class ChartBasic extends Vue {
  mounted() {
    const svg = select(this.$el)
      .append('svg')
      .attr('width', 500)
      .attr('height', 270)
      .append('g')
      .attr('transform', 'translate(0, 10)')
    const x = scaleLinear().range([0, 430])
    const y = scaleLinear().range([210, 0])
    axisLeft().scale(x)
    axisTop().scale(y)
    x.domain(extent(data, (d, i) => i))
    y.domain([0, max(data, d => d)])
    const createPath = line()
      .x((d, i) => x(i))
      .y(d => y(d))
    svg.append('path').attr('d', createPath(data))
  }
}
</script>

<style lang='stylus'>
.chart-basic
  svg
    margin 25px
    path
      fill none
      stroke #76BF8A
      stroke-width 3px
</style>
