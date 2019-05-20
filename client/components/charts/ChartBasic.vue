<template lang='pug'>
svg.chart-basic(:width='width', :height='width')
  g(style='transform: translate(0, 10px)')
    path(:d='line')
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import * as d3 from 'd3'

interface Node extends d3.SimulationNodeDatum {
  id: string
  group: number
}

interface Link extends d3.SimulationLinkDatum<Node>{
  value: number
}

const nodes: Node[] = [
  { 'id': '1', 'group': 1 },
  { 'id': '2', 'group': 2 },
  { 'id': '4', 'group': 3 },
  { 'id': '8', 'group': 4 },
  { 'id': '16', 'group': 5 },
  { 'id': '11', 'group': 1 },
  { 'id': '12', 'group': 2 },
  { 'id': '14', 'group': 3 },
  { 'id': '18', 'group': 4 },
  { 'id': '116', 'group': 5 },
]
const links: Link[] = [
  { 'source': '1', 'target': '2', 'value': 1 },
  { 'source': '2', 'target': '4', 'value': 1 },
  { 'source': '4', 'target': '8', 'value': 1 },
  { 'source': '4', 'target': '8', 'value': 1 },
  { 'source': '8', 'target': '16', 'value': 1 },
  { 'source': '16', 'target': '1', 'value': 1 },
]

@Component
export default class ChartBasic extends Vue {
  width = 500
  height = 500

  get svg() {
    return d3.select(this.$el)
  }

  async mounted() {
    const svg = this.svg

    const simulation = d3.forceSimulation<Node>()
    // @ts-ignore
      .force('link', d3.forceLink().id((d) => { return d.id }))
      // .force("charge", d3.forceManyBody().strength(-200))
      .force('charge', d3.forceManyBody()
        .strength(-200)
        .theta(0.8)
        .distanceMax(150)
      )
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
      //  simulation.fix(d);
    }

    function dragged(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
      //  simulation.fix(d, d3.event.x, d3.event.y);
    }

    function dragended(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
      if (!d3.event.active) simulation.alphaTarget(0)
      // simulation.unfix(d);
    }

    const link = svg.append('g')
      .style('stroke', '#aaa')
      .selectAll('line')
      .data(links)
      .enter().append('line')

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 2)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    const label = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('class', 'label')
      .text((d) => { return d.id })

    function ticked() {
      link
        // @ts-ignore
        .attr('x1', (d) => { return d.source.x })
        // @ts-ignore
        .attr('y1', (d) => { return d.source.y })
        // @ts-ignore
        .attr('x2', (d) => { return d.target.x })
        // @ts-ignore
        .attr('y2', (d) => { return d.target.y })

      node
        .attr('r', 16)
        .style('fill', '#efefef')
        .style('stroke', '#424242')
        .style('stroke-width', '1px')
        // @ts-ignore
        .attr('cx', (d) => { return d.x + 5 })
        // @ts-ignore
        .attr('cy', (d) => { return d.y - 3 })

      label
        // @ts-ignore
        .attr('x', (d) => { return d.x })
        .attr('y', (d) => { return d.y })
        .style('font-size', '10px').style('fill', '#333')
    }

    simulation
      .nodes(nodes)
      .on('tick', ticked)

    // @ts-ignore
    simulation.force('link').links(links)
  }
}
</script>

<style lang='stylus'>
svg
  user-select none
</style>
