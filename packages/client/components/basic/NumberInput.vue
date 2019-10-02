<template lang='pug'>
v-text-field(
  ref='input'
  :label='label'
  :class='classes'
  v-bind='$attrs',
  v-model='inner_value'
  :readonly='isMobile'
  @keydown.native='onKeydown'
  @focus='onFocus'
)
</template>

<script lang='ts'>
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import SoftNumpad from './SoftNumpad.vue'
import CommonMixin from '~/mixins/common'

const operatorRegex = /[+|\-|*|/]/g
const defaultMax = 1_000_000_000

@Component({
  inheritAttrs: false,
})
export default class NumberInput extends mixins(CommonMixin) {
  @Prop({ default: 0 }) readonly value!: number
  @Prop({ default: defaultMax }) readonly max!: number
  // for displaying style
  @Prop(Boolean) readonly flat?: boolean
  @Prop(Boolean) readonly bold?: boolean
  @Prop(Boolean) readonly main?: boolean
  @Prop(Boolean) readonly hideLabel?: boolean
  // keyboard
  @Prop(Boolean) readonly rounded?: boolean
  @Prop(Boolean) readonly disableOperators?: boolean
  // if not true, value will be reset on every first input
  @Prop(Boolean) readonly sustained?: boolean
  // set class when actives
  @Prop({ default: 'number-input--active' }) readonly activeClass!: string

  numpad: SoftNumpad | null = null
  inner_value = ''
  warned = false
  dirty = false

  private mounted () {
    this.updateInnerValue()
  }

  get classes () {
    return {
      'number-input': true,
      flat: this.flat,
      main: this.main,
      bold: this.bold,
      [this.activeClass]: !!this.numpad,
    }
  }

  get label () {
    if (this.hideLabel)
      return null
    if (this.calculatedStr !== this.inner_value)
      return `= ${this.calculated.toString()}`
    return null
  }

  get calculatedStr () {
    if (this.calculated === 0)
      return ''
    else
      return this.calculated.toString()
  }

  get parts () {
    return this.inner_value.split(operatorRegex)
  }

  get lastPart () {
    return this.parts[this.parts.length - 1]
  }

  get calculated (): number {
    try {
      const value = this.trimTailOperator(this.inner_value)
      if (!value)
        return 0
      const escaped = value.replace(/[^-()\d/*+.]/g, '')
      // eslint-disable-next-line no-eval
      return this.round(eval(escaped))
    }
    catch (e) {
      // eslint-disable-next-line
      console.error(e)
      return 0
    }
  }

  get hasOperator () {
    return !!this.inner_value.match(operatorRegex)
  }

  get isFocused () {
    return !!this.numpad
  }

  @Watch('calculated')
  private onCalculated () {
    this.$emit('input', this.calculated)
    if (this.numpad)
      this.$emit('user-input', this.calculated)
  }

  @Watch('value')
  private onValueChanged () {
    this.updateInnerValue()
  }

  @Watch('hasOperator')
  private updateKeyboardState () {
    if (this.numpad)
      this.numpad.dirty = this.hasOperator
  }

  round (value: number) {
    return Math.round(value * 100) / 100
  }

  updateInnerValue () {
    if (this.round(this.value) !== this.calculated) {
      this.inner_value = this.value.toString()
      this.calculate()
    }
  }

  isOperator (char: string) {
    return '+-*/.'.includes(char)
  }

  trimTailOperator (value: string) {
    const lastchar = value[value.length - 1]
    if (this.isOperator(lastchar))
      return value.slice(0, value.length - 1)
    return value
  }

  addOperator (operator) {
    this.inner_value = this.trimTailOperator(this.inner_value)
    if (this.inner_value === '')
      return this.error()
    this.inner_value += operator
  }

  calculate () {
    if (this.calculated === 0)
      this.inner_value = ''
    else
      this.inner_value = this.calculated.toString()
  }

  input (char: string) {
    if (!this.sustained && !this.dirty)
      this.clear()

    if (this.inner_value === '0')
      this.clear()

    if (this.calculated > this.max)
      return this.error()
    if (this.inner_value === '' && char === '0')
      return this.error()

    this.dirty = true

    if (char === '.')
      this.inputDot()
    else if (this.isOperator(char))
      this.addOperator(char)
    else
      this.inner_value += char
  }

  error () {
    // TODO:AF shake
  }

  onFocus () {
    this.$emit('focus', this)
  }

  private setValue (value) {
    this.inner_value = value
  }

  inputDot () {
    if (this.lastPart.includes('.'))
      return
    if (this.lastPart.length === 0)
      this.inner_value += '0.'
    else
      this.inner_value += '.'
  }

  backspace () {
    this.inner_value = this.inner_value.slice(0, this.inner_value.length - 1)
    if (this.inner_value === '0')
      this.clear()

    this.dirty = true
  }

  clear () {
    this.inner_value = ''
  }

  focus () {
    try {
      // @ts-ignore
      this.$refs.input.focus()
    }
    catch {}
  }

  private onKeydown (e: KeyboardEvent) {
    // TODO:AF more checks based on value

    if (!this.warned) {
      this.$snack('Using keyboard to input is an experimenting function.', { color: 'red' })
      this.warned = true
    }

    if (e.keyCode === 8) // Backspace
      return
    if (e.keyCode === 13) // Enter
      return this.calculate()
    if ([37, 39].includes(e.keyCode)) // Left & Right key
      return
    if ('1234567890+-*/'.includes(e.key))
      return

    // eslint-disable-next-line
    console.log('KEY_PRESSED', e)

    e.preventDefault()
  }

  public registerKeyboard (numpad: SoftNumpad) {
    this.deregisterKeyboard()
    numpad.$on('input', this.input)
    numpad.$on('backspace', this.backspace)
    numpad.$on('clear', this.clear)
    numpad.$on('calculate', this.calculate)
    numpad.rounded = !!this.rounded
    numpad.disableOperators = !!this.disableOperators

    this.numpad = numpad
    this.dirty = false
  }

  public deregisterKeyboard () {
    if (this.numpad) {
      this.numpad.$off('input', this.input)
      this.numpad.$off('backspace', this.backspace)
      this.numpad.$off('clear', this.clear)
      this.numpad.$off('calculate', this.calculate)
    }
    this.numpad = null
  }
}
</script>

<style lang='sass'>
.number-input
  &.main
    label
      font-size: 1.8em
      height: inherit
      line-height: inherit

    input
      max-height: inherit
      font-size: 3em
      margin-top: 0

    label
      top: -0.1em

  &.bold
    input
      font-weight: bold

.number-input--active
  .v-input__slot:before
    border-color: var(--theme-primary) !important
  input
    color: var(--theme-primary) !important
</style>
