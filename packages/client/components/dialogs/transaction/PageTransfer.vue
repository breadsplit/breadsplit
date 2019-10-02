<template lang='pug'>
.height-100.page-transfer(v-rows='"auto max-content"')

  transfer-form.mx-5.my-10(
    :form='form'
    :disabled='disabled'
  )

  div
    fee-input(
      ref='fee_input'
      :form='form'
      @keyboard='openKeyboard'
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
import TransferForm from './TransferForm.vue'
import { Transaction } from '~/types'
import SoftNumpad from '~/components/basic/SoftNumpad.vue'
import NumberInput from '~/components/basic/NumberInput.vue'
import { GroupMixin } from '~/mixins'

@Component({
  components: {
    FeeInput,
    TransferForm,
  },
})
export default class PageTransfer extends mixins(GroupMixin) {
  registeredInput: NumberInput | null = null

  @Prop(Object) readonly form!: Transaction
  @Prop({ default: true }) readonly showFee?: boolean
  @Prop(Boolean) readonly disabled?: boolean

  $refs!: {
    numpad: SoftNumpad
    fee_input: FeeInput
  }

  @Watch('form', { immediate: true })
  onFormChanged () {
    this.$nextTick(() => {
      this.$refs.fee_input.open()
    })
  }

  get showKeyboard () {
    return !!this.registeredInput
  }

  closeKeyboard () {
    this.registeredInput = null
  }

  openKeyboard (e: NumberInput | null) {
    if (this.registeredInput) {
      this.registeredInput.calculate()
      this.registeredInput.deregisterKeyboard()
    }
    if (e)
      e.registerKeyboard(this.$refs.numpad)
    this.registeredInput = e
  }

  public finishUp () {
    this.closeKeyboard()
  }
}
</script>
