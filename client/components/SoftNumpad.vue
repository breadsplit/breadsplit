<template lang='pug'>
v-card.soft-numpad(flat :class='classes')
  .numbers
    .button(v-for='i in 9' v-ripple @click='enter(i)') {{i}}
    .button(v-ripple @click='enterDot()') .
    .button(v-ripple @click='enter(0)') 0
    .button(v-ripple @click='backspace()' v-longpress='clear')
      v-icon mdi-backspace

  .operators
    .button(v-ripple @click='addOperator("-")')
      v-icon mdi-minus
    .button(v-ripple @click='addOperator("+")')
      v-icon mdi-plus
    .button(v-ripple @click='addOperator("*")')
      v-icon mdi-multiplication
    .button(v-ripple @click='addOperator("/")')
      v-icon mdi-division
    .button(v-ripple @click='calc()')
      v-icon mdi-equal

</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class SoftNumpad extends Vue {
  @Prop(Boolean) readonly absolute?: boolean
  @Prop(Boolean) readonly fixed?: boolean
  @Prop({ default: 16 }) readonly maxlength!: number
  @Prop() readonly bind?: HTMLInputElement

  value = ''

  get classes() {
    return {
      absolute: this.absolute,
      fixed: this.fixed,
    }
  }

  get parts() {
    return this.value.split(/\+|-|\*|\//)
  }

  get lastPart() {
    return this.parts[this.parts.length - 1]
  }

  get calculated(): number {
    const value = this.trimTailOperator(this.value)
    if (!value)
      return 0
    const escaped = value.replace(/[^-()\d/*+.]/g, '')
    // eslint-disable-next-line no-eval
    return (Math.round(eval(escaped) * 100) / 100)
  }

  @Watch('bind')
  onBindChanged() {
    if (!this.bind)
      this.value = ''
    else
      this.value = this.bind.value
  }

  @Watch('value')
  onValueChanged() {
    if (this.bind)
      this.bind.value = this.value
  }

  isOperator(char: string) {
    return '+-*/.'.includes(char)
  }

  close(result?) {
    this.$emit('close', result)
  }

  trimTailOperator(value: string) {
    const lastchar = value[value.length - 1]
    if (this.isOperator(lastchar))
      return value.slice(0, this.value.length - 1)
    return value
  }

  addOperator(operator) {
    if ('+-'.includes(operator))
      this.calc()
    this.value = this.trimTailOperator(this.value)
    this.value += operator
  }

  calc() {
    this.value = this.calculated.toString()
  }

  enter(number) {
    if (this.lastPart.length >= this.maxlength)
      return
    this.value += number
  }

  enterDot() {
    if (this.lastPart.includes('.'))
      return
    if (this.lastPart.length === 0)
      this.value += '0.'
    else
      this.value += '.'
  }

  backspace() {
    this.value = this.value.slice(0, this.value.length - 1)
  }

  clear() {
    this.value = ''
  }
}
</script>

<style lang='stylus'>
.soft-numpad
  width 100%
  display grid
  grid-template-columns 80fr 20fr
  text-align center

  &.absolute
    position absolute
    bottom 0
    left 0
    right 0

  &.fixed
    position fixed
    bottom 0
    left 0
    right 0

  .numbers
    display grid
    grid-template-columns 1fr 1fr 1fr

    .button
      height 80px
      line-height 80px
      font-size 1.8em

  .operators
    display grid
    grid-template-rows 1fr 1fr 1fr 1fr 1fr

  .button
    position relative

    .v-icon
      position absolute
      top 50%
      left 50%
      transform translateY(-50%) translateX(-50%)

  &.theme--light
    background #f5f5f5

    .operators
      background #eee

  &.theme--dark
    background #303030

    .operators
      background #282828

</style>
