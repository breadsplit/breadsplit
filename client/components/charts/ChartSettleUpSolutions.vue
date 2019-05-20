<template lang='pug'>
svg.chart-settle-up-solutions(:width='width', :height='height')
  defs
    marker#arrow(markerunits='strokeWidth', markerwidth='12', markerheight='12', viewbox='0 0 12 12', refx='6', refy='6', orient='auto')
      path(d='M2,2 L10,6 L2,10 L6,6 L2,2', style='fill: #f00;')
</template>

<script lang='ts'>
import { Component, Prop, Mixins } from 'vue-property-decorator'
import union from 'lodash/union'
import { Solution } from '~/core'
import { UserInfoMixin } from '~/mixins'
import { Member, UserInfo } from '~/types'
import * as d3 from 'd3'

interface Node extends d3.SimulationNodeDatum, UserInfo, Member {}

interface Link extends d3.SimulationLinkDatum<Node>{
  value: number
}

@Component
export default class ChartSettleUpSolutions extends Mixins(UserInfoMixin) {
  width = 500
  height = 500

  @Prop(Array) readonly solutions!: Solution[]

  get ids() {
    return union(this.solutions.flatMap(s => [s.from, s.to]))
  }

  get nodes(): Node[] {
    return this.ids
      .map(id => this.getUser(id))
      .filter(i => i !== undefined) as Node[]
  }

  get links(): Link[] {
    return this.solutions.map(s => ({
      target: s.to,
      source: s.from,
      value: s.amount,
    }))
  }

  get svg() {
    return d3.select(this.$el)
  }

  async mounted() {
    const svg = this.svg

    const simulation = d3.forceSimulation<Node>()
    // @ts-ignore
      .force('link', d3.forceLink().id((d) => { return d.uid || d.id }))
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
      .data(this.links)
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)')

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr('r', 2)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    const label = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(this.nodes)
      .enter()
      .append('text')
      .attr('class', 'name-tag')
      .attr('text-anchor', 'middle')
      .text((d) => { return d.name })

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
      .nodes(this.nodes)
      .on('tick', ticked)

    // @ts-ignore
    simulation.force('link').links(this.links)
  }
}
</script>

<style lang='stylus'>
svg.chart-settle-up-solutions
  user-select none

  .name-tag
    transform translate(5px, 25px)
</style>
