<template lang='pug'>
v-card.soft-numpad(flat :class='classes')
  .numbers
    .button(v-for='i in numbers' v-ripple @click='input(i)') {{i}}
    .button(v-ripple @click='input(".")' :class='dotClass') .
    .button(v-ripple @click='input(0)') 0
    .button(v-ripple @click='backspace()' v-longpress='clear')
      v-icon mdi-backspace

  .operators
    .button(v-ripple @click='input("-")' :class='operatorClass')
      v-icon mdi-minus
    .button(v-ripple @click='input("+")' :class='operatorClass')
      v-icon mdi-plus
    .button(v-ripple @click='input("*")' :class='operatorClass')
      v-icon mdi-multiplication
    .button(v-ripple @click='input("/")' :class='operatorClass')
      v-icon mdi-division
    .button(v-if='dirty' v-ripple @click='calculate()')
      v-icon mdi-equal
    .button(v-else v-ripple @click='close()')
      v-icon mdi-keyboard-close

</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { Vibrate } from '~/utils'

@Component
export default class SoftNumpad extends Vue {
  @Prop(Boolean) readonly absolute?: boolean
  @Prop(Boolean) readonly fixed?: boolean

  rounded = false
  disableOperators = false
  numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3]

  public dirty = false

  get classes() {
    return {
      absolute: this.absolute,
      fixed: this.fixed,
    }
  }

  get operatorClass() {
    return {
      disabled: this.disableOperators,
    }
  }

  get dotClass() {
    return {
      disabled: this.rounded,
    }
  }

  input(char: string|number) {
    this.vibrate()
    this.$emit('input', char.toString())
  }

  backspace() {
    this.vibrate()
    this.$emit('backspace')
  }

  calculate() {
    this.vibrate()
    this.$emit('calculate')
  }

  clear() {
    this.vibrate()
    this.$emit('clear')
  }

  close() {
    this.$emit('close')
  }

  vibrate() {
    Vibrate()
  }
}
</script>

<style lang='sass'>
.soft-numpad
  width: 100%
  display: grid
  grid-template-columns: 80fr 20fr
  text-align: center
  user-select: none

  &.absolute
    position: absolute
    bottom: 0
    left: 0
    right: 0

  &.fixed
    position: fixed
    bottom: 0
    left: 0
    right: 0

  .numbers
    display: grid
    grid-template-columns: 1fr 1fr 1fr

    .button
      height: 65px
      line-height: 65px
      font-size: 1.8em

  .operators
    display: grid
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr

  .button
    position: relative
    cursor: pointer

    &.disabled
      opacity: 0.5
      pointer-events: none

    .v-icon
      position: absolute
      top: 50%
      left: 50%
      transform: translateY(-50%) translateX(-50%)

  &.theme--light
    background: #f5f5f5

    .operators
      background: #eee

  &.theme--dark
    background: #202020 !important

    .operators
      background: #282828

</style>
