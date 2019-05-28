<template lang='pug'>
.height-100(v-rows='"max-content auto max-content"')
  .page-container
    .header {{title}}

  app-splitting(
    ref='splitting'
    :trans='trans'
    :members='members'
    :on='on'
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
        :value='trans.total_fee'
        @user-input='v=>trans.total_fee=v'
        @focus='openKeyboard'
        placeholder='0'
        reverse outline autofocus
        required hide-details flat main
      )
      div(v-rows='"auto 45px"')
        span
        app-currency-select.mt-0.pt-0(v-model='trans.currency')

    .mt-3(v-else)

    app-soft-numpad(
      ref='numpad'
      v-show='showKeyboard'
    )

</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Transaction, Member } from '~/types'

@Component
export default class SplittingPage extends Vue {
  registeredInput = null

  @Prop(Object) readonly trans!: Transaction
  @Prop({ default: 'debtors' }) readonly on!: 'debtors' | 'creditors'
  @Prop({ default: () => [] }) readonly members!: Member[]
  @Prop({ default: '' }) readonly title!: string

  get showKeyboard() {
    return !!this.registeredInput
  }

  openKeyboard(e) {
    if (this.registeredInput) {
      // @ts-ignore
      this.registeredInput.calculate()
      // @ts-ignore
      this.registeredInput.deregisterKeyboard()
    }
    // @ts-ignore
    e.registerKeyboard(this.$refs.numpad)
    this.registeredInput = e
  }
}
</script>
