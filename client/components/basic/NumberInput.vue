<template lang='pug'>
v-text-field(
  :label='calculated.toString()'
  v-bind='$attrs',
  v-model='inner_value'
  @keydown.native='onKeydown'
  @focus='onFocus'
)
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'
import SoftNumpad from './SoftNumpad.vue'

@Component({
  inheritAttrs: true,
})
export default class NumberInput extends Vue {
  @Prop({ default: 0 }) readonly value!: number

  numpad: SoftNumpad | null = null
  inner_value: string = ''

  deregisterKeyboard() {
    if (this.numpad) {
      this.numpad.$off('input', this.input)
      this.numpad.$off('backspace', this.backspace)
      this.numpad.$off('clear', this.clear)
      this.numpad.$off('calculate', this.calculate)
    }
    this.numpad = null
  }

  registerKeyboard(numpad: SoftNumpad) {
    this.deregisterKeyboard()
    numpad.$on('input', this.input)
    numpad.$on('backspace', this.backspace)
    numpad.$on('clear', this.clear)
    numpad.$on('calculate', this.calculate)

    this.numpad = numpad
  }

  get parts() {
    return this.inner_value.split(/\+|-|\*|\//)
  }

  get lastPart() {
    return this.parts[this.parts.length - 1]
  }

  get calculated(): number {
    try {
      const value = this.trimTailOperator(this.inner_value)
      if (!value)
        return 0
      const escaped = value.replace(/[^-()\d/*+.]/g, '')
      // eslint-disable-next-line no-eval
      return (Math.round(eval(escaped) * 100) / 100)
    }
    catch (e) {
      // eslint-disable-next-line
      console.error(e)
      return 0
    }
  }

  mounted() {
    this.inner_value = this.value.toString()
    this.calculate()
  }

  isOperator(char: string) {
    return '+-*/.'.includes(char)
  }

  trimTailOperator(value: string) {
    const lastchar = value[value.length - 1]
    if (this.isOperator(lastchar))
      return value.slice(0, value.length - 1)
    return value
  }

  addOperator(operator) {
    this.inner_value = this.trimTailOperator(this.inner_value)
    this.inner_value += operator
  }

  calculate() {
    if (this.calculated === 0)
      this.inner_value = ''
    else
      this.inner_value = this.calculated.toString()
  }

  input(char: string) {
    if (char === '.')
      this.inputDot()
    else if (this.isOperator(char))
      this.addOperator(char)
    else
      this.inner_value += char
  }

  onFocus() {
    this.$emit('focus', this)
  }

  setValue(value) {
    this.inner_value = value
  }

  inputDot() {
    if (this.lastPart.includes('.'))
      return
    if (this.lastPart.length === 0)
      this.inner_value += '0.'
    else
      this.inner_value += '.'
  }

  backspace() {
    this.inner_value = this.inner_value.slice(0, this.inner_value.length - 1)
  }

  clear() {
    this.inner_value = ''
  }

  focus() {
    // @ts-ignore
    this.$refs.input.$el.focus()
  }

  onKeydown(e: KeyboardEvent) {
    if (e.keyCode === 8) // Backspace
      return
    if (e.keyCode === 13) // Enter
      return this.calculate()
    if ('1234567890+-*/'.includes(e.key))
      return
    e.preventDefault()
  }
}
</script>
