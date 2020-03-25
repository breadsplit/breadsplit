<template lang='pug'>
.mx-3(
  v-columns='"max-content auto 65px"'
  style='vertical-align:bottom'
)
  div(v-rows='"auto max-content"')
    div
    .my-3.ml-2 {{$t('ui.total')}}

  app-number-input(
    ref='input'
    :value='form.total_fee'
    @user-input='v=>form.total_fee=v'
    @focus='open'
    placeholder='0'
    reverse outline autofocus
    required hide-details flat main
  ).pr-2

  div(v-rows='"auto 45px"')
    span
    app-currency-select.mt-0.pt-0(v-model='form.currency' mini :codes='currencies')
</template>

<script lang='ts'>
import { mixins, Component, Prop } from 'nuxt-property-decorator'
import { Transaction } from '~/types'
import { GroupMixin } from '~/mixins'

@Component
export default class FeeInput extends mixins(GroupMixin) {
  @Prop(Object) readonly form!: Transaction

  open() {
    this.$emit('keyboard', this.$refs.input)
  }
}
</script>
