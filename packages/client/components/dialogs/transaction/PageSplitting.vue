<template lang='pug'>
.height-100(v-rows='"auto max-content"')
  app-splitting(
    ref='splitting'
    :trans='form'
    :members='members'
    :on='on'
    :allow-add='allowAdd'
    @keyboard='openKeyboard'
  )

  div
    fee-input(
      ref='fee_input'
      v-if='on==="creditors"'
      :form='form'
      @keyboard='openKeyboardForMainInput'
    )
    v-expand-transition
      app-soft-numpad(
        ref='numpad'
        v-show='showKeyboard'
        @close='closeKeyboard'
      )
</template>

<script lang='ts'>
import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
import FeeInput from './FeeInput.vue'
import { Transaction } from '~/types'
import SoftNumpad from '~/components/basic/SoftNumpad.vue'
import Splitting from '~/components/composed/Splitting.vue'
import NumberInput from '~/components/basic/NumberInput.vue'
import { GroupMixin } from '~/mixins'

@Component({
  components: {
    FeeInput,
  },
})
export default class PageSplitting extends mixins(GroupMixin) {
  registeredInput: NumberInput | null = null

  @Prop(Object) readonly form!: Transaction
  @Prop({ default: 'debtors' }) readonly on!: 'debtors' | 'creditors'
  @Prop({ default: false }) readonly allowAdd?: boolean

  $refs!: {
    splitting: Splitting
    numpad: SoftNumpad
    fee_input: FeeInput
  }

  @Watch('form', { immediate: true })
  onFormChanged() {
    if (this.on === 'creditors') {
      this.$nextTick(() => {
        this.$refs.fee_input.open()
      })
    }
  }

  get showKeyboard() {
    return !!this.registeredInput
  }

  closeKeyboard() {
    this.registeredInput = null
  }

  openKeyboardForMainInput(e) {
    this.$refs.splitting.cleanUp(false)
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
    this.$refs.splitting.cleanUp(false)
    this.$refs.splitting.focused = null
    this.closeKeyboard()
  }
}
</script>
