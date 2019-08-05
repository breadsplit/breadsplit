<template lang='pug'>
.balance-item(:key='balance.uid' @click='gotoNewTransaction({from: balance.uid})')
  .text(:class='textClass')
    app-user-info(:id='balance.uid')
    app-money-label.money(
      :amount='balance.balance'
      :currency='balance.currency'
      color
    )
  .bar(:style='barStyle' :class='textClass')
  app-user-avatar(:id='balance.uid' size='42')
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import * as d3 from 'd3'
import { NavigationMixin } from '~/mixins'
import { Balance } from '~/types'
import 'd3-scale-chromatic'

@Component
export default class Balances extends mixins(NavigationMixin) {
  @Prop(Object) balance!: Balance
  @Prop(Number) max!: number
  @Prop(Number) min!: number

  get value () {
    return +this.balance.balance
  }

  get colorScale () {
    return d3.scaleSequential(d3.interpolateRdYlGn).domain([this.min, this.max])
  }

  get textClass () {
    return {
      left: this.value >= 0,
      right: this.value < 0,
    }
  }

  get barStyle () {
    return {
      width: `${this.width}%`,
      background: this.colorScale(this.value),
    }
  }

  get absMax () {
    return Math.max(this.max, Math.abs(this.min), 100)
  }

  get width () {
    return Math.abs(this.value / this.absMax * 45)
  }
}
</script>

<style lang="sass">
.balance-item
  position: relative
  height: 42px
  margin: 5px

  .user-avatar
    display: inline-block
    position: absolute
    left: 0
    right: 0
    top: 0

  .text
    position: absolute
    background: #88888810
    padding: 0 15px
    border-radius: 10px
    min-width: 100px

    &.left
      text-align: right
      right: calc(50%)
      padding-right: 30px

    &.right
      text-align: left
      left: calc(50%)
      padding-left: 30px

  .bar
    position: absolute
    top: 0
    bottom: 0
    border-radius: 10px
    opacity: 0.8

    &.left
      left: 50%

    &.right
      right: 50%

  .money
    display: block
    margin-top: -5px
</style>
