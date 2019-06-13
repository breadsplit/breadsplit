<template lang='pug'>
.height-100(v-rows='"max-content auto max-content"')
  .page-container
    .header {{title}}
    .subheader(v-if='subtitle') {{subtitle}}

  app-splitting(
    ref='splitting'
    :trans='form'
    :members='members'
    :on='on'
    :mode.sync='mode'
    @keyboard='openKeyboard'
  )

  div
    .mx-3(
      v-if='on==="creditors"'
      v-columns='"max-content auto 65px"'
      style='vertical-align:bottom'
    )
      div(v-rows='"auto max-content"')
        div
        .my-3.ml-2 {{$t('ui.total')}}
      app-number-input(
        ref='total_fee_input'
        :value='form.total_fee'
        @user-input='v=>form.total_fee=v'
        @focus='openKeyboardForMainInput'
        placeholder='0'
        reverse outline autofocus
        required hide-details flat main
      )
      div(v-rows='"auto 45px"')
        span
        app-currency-select.mt-0.pt-0(v-model='form.currency' mini)

    v-expand-transition
      app-soft-numpad(
        ref='numpad'
        v-show='showKeyboard'
        @close='closeKeyboard'
      )

</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Transaction, Member } from '~/types'
import { Splitmode } from '~/core'
import SoftNumpad from '~/components/basic/SoftNumpad.vue'
import NumberInput from '~/components/basic/NumberInput.vue'
import Splitting from '~/components/composed/Splitting.vue'

@Component
export default class PageSplitting extends Vue {
  registeredInput: NumberInput | null = null
  mode: Splitmode = 'average'

  @Prop(Object) readonly form!: Transaction
  @Prop({ default: 'debtors' }) readonly on!: 'debtors' | 'creditors'
  @Prop({ default: () => [] }) readonly members!: Member[]
  @Prop({ default: '' }) readonly title!: string
  @Prop({ default: '' }) readonly subtitle!: string

  $refs!: {
    splitting: Splitting
    numpad: SoftNumpad
    total_fee_input: NumberInput
  }

  @Watch('form', { immediate: true })
  onFormChanged() {
    if (this.on === 'creditors') {
      this.mode = 'amount'
      this.$nextTick(() => {
        this.openKeyboardForMainInput(this.$refs.total_fee_input)
      })
    }
    else {
      this.mode = 'average'
    }
  }

  get showKeyboard() {
    return !!this.registeredInput
  }

  closeKeyboard() {
    this.registeredInput = null
  }

  openKeyboardForMainInput(e) {
    this.$refs.splitting.gcd()
    this.$refs.splitting.clear()
    this.$refs.splitting.focused = null
    this.openKeyboard(e)
  }

  openKeyboard(e: NumberInput | null) {
    if (this.registeredInput) {
      this.registeredInput.calculate()
      this.registeredInput.deregisterKeyboard()
    }
    if (e)
      e.registerKeyboard(this.$refs.numpad)
    this.registeredInput = e
  }

  public finishUp() {
    this.$refs.splitting.gcd()
    this.$refs.splitting.clear()
    this.$refs.splitting.focused = null
    this.closeKeyboard()
  }
}
</script>
