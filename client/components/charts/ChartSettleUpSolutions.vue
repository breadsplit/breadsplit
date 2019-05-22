<template lang='pug'>
svg.chart-settle-up-solutions(
  :width='fixed?width:undefined'
  :height='fixed?height:undefined'
  :viewBox='`0 0 ${width} ${height}`'
  preserveAspectRatio='xMidYMid meet'
)
</template>

<script lang='ts'>
import { Component, Prop, Mixins } from 'vue-property-decorator'
import union from 'lodash/union'
import { Solution } from '~/core'
import { UserInfoMixin } from '~/mixins'
import { UserMemberInfo } from '~/types'
import * as d3 from 'd3'
import { IdMe } from '../../../core/id_helper'

interface Node extends d3.SimulationNodeDatum, UserMemberInfo {}

interface Link extends d3.SimulationLinkDatum<Node>{
  value: number
}

@Component
export default class ChartSettleUpSolutions extends Mixins(UserInfoMixin) {
  @Prop(Array) readonly solutions!: Solution[]
  @Prop({ default: 800 }) readonly width!: number
  @Prop({ default: 600 }) readonly height!: number
  @Prop({ default: false }) readonly fixed!: boolean

  simulation!: d3.Simulation<Node, Link>

  get ids() {
    return union(this.solutions.flatMap(s => [s.from, s.to]))
  }

  get nodes(): Node[] {
    return this.ids
      .map((id) => {
        const user = this.getUser(id)
        if (user && id === IdMe)
          user.uid = IdMe
        return user
      })
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

  mounted() {
    this.init()
    this.draw()
  }

  init() {
    this.simulation = d3.forceSimulation<Node, Link>()
      .force('link', d3.forceLink<Node, Link>().id(d => d.uid || ''))
      .force('charge', d3.forceManyBody()
        .strength(-1000)
        .theta(0.8)
        .distanceMax(500)
      )
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
  }

  dragstarted(d) {
    if (!d3.event.active)
      this.simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  dragended(d) {
    d.fx = null
    d.fy = null
    if (!d3.event.active)
      this.simulation.alphaTarget(0)
  }

  draw() {
    const svg = this.svg

    const defs = svg.append('svg:defs')
    const avatar_size = 48

    // arrow
    defs.append('svg:marker')
      .attr('id', 'arrow')
      .attr('refX', 6)
      .attr('refY', 6)
      .attr('markerWidth', 15)
      .attr('markerHeight', 15)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 12 6 0 12 3 6')
      .style('fill', 'black')

    // avatars
    defs.selectAll('.avatar-defs')
      .data(this.nodes)
      .enter()
      .append('pattern')
      .attr('class', 'avatar-defs')
      .attr('id', d => d.uid)
      .attr('height', 1)
      .attr('width', 1)
      .attr('x', 0)
      .attr('y', 0)
      .append('image')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', avatar_size)
      .attr('width', avatar_size)
      .attr('xlink:href', d => d.avatar_url || '')

    const link = svg.append('g')
      .style('stroke', '#aaa')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#triangle)')

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('.node')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr('r', 16)
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended))

    node.append('circle')
      .attr('class', 'avatar')
      .attr('r', avatar_size / 2)
      .attr('rx', 0)
      .attr('ry', 0)
      .attr('stroke-width', '2px')
      .attr('fill', d => `url(#${d.uid})`)

    node.append('text')
      .attr('class', 'name-tag')
      .attr('text-anchor', 'middle')
      .style('font-size', '1em')
      .text(d => d.name)

    function ticked() {
      link
        // @ts-ignore
        .attr('x1', d => d.source.x)
        // @ts-ignore
        .attr('y1', d => d.source.y)
        // @ts-ignore
        .attr('x2', d => d.target.x)
        // @ts-ignore
        .attr('y2', d => d.target.y)

      node
        // @ts-ignore
        .attr('transform', d => `translate(${d.x},${d.y})`)
    }

    this.simulation
      .nodes(this.nodes)
      .on('tick', ticked)

    // @ts-ignore
    this.simulation.force('link').links(this.links)
  }
}
</script>

<style lang='stylus'>
svg.chart-settle-up-solutions
  user-select none

  .name-tag
    transform translate(0, 40px)
    font-size 1em
    fill #333

    .theme--dark &
      fill #fff

  .avatar
    stroke #fff

    .theme--dark &
      stroke #555
</style>
