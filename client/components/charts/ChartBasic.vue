<template lang='pug'>
svg.chart-basic(width='500', height='270')
  g(style='transform: translate(0, 10px)')
    path(:d='line')
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import {
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
  get line() {
    const x = scaleLinear().range([0, 430])
    const y = scaleLinear().range([210, 0])
    axisLeft().scale(x)
    axisTop().scale(y)
    x.domain(extent(data, (d, i) => i))
    y.domain([0, max(data, d => d)])
    const createPath = line()
      .x((d, i) => x(i))
      .y(d => y(d))
    return createPath(data)
  }
}
</script>

<style lang='stylus'>
svg.chart-basic
  margin 25px
  path
    fill none
    stroke #76BF8A
    stroke-width 3px
</style>
