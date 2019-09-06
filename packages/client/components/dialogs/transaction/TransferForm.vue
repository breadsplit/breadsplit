<template lang='pug'>
.transfer-form.text-center(v-columns='"auto max-content max-content max-content auto"')
  div

  app-member-select(
    v-model='creditor'
    :disabled='disabled'
    :members='creditCandidates'
  )

  span.px-4
    app-money-label.primary--text(
      :amount='form.total_fee'
      :currency='form.currency'
      style='font-size: 1.1em'
      v-if='showFee'
    ).mx-4
    .arrow.op-50
      .line
      .point

  app-member-select(
    v-model='debtor'
    :disabled='disabled'
    :members='debtCandidates'
  )

  div
</template>

<script lang='ts'>
import { mixins, Component, Prop } from 'nuxt-property-decorator'
import { oc } from 'ts-optchain'
import { Transaction } from '~/types'
import { GroupMixin } from '~/mixins'

@Component
export default class TransferForm extends mixins(GroupMixin) {
  @Prop(Object) readonly form!: Transaction
  @Prop({ default: true }) readonly showFee?: boolean
  @Prop(Boolean) readonly disabled?: boolean

  get creditor () {
    return oc(this.form.creditors)[0].uid(undefined)
  }

  set creditor (v) {
    if (!v) {
      this.form.creditors = []
    }
    else {
      const old = this.creditor
      this.form.creditors = [{ uid: v, weight: 1 }]
      if (v === this.debtor)
        this.debtor = old
    }
  }

  get debtor () {
    return oc(this.form.debtors)[0].uid(undefined)
  }

  set debtor (v) {
    if (!v) {
      this.form.debtors = []
    }
    else {
      const old = this.debtor
      this.form.debtors = [{ uid: v, weight: 1 }]
      if (v === this.creditor)
        this.creditor = old
    }
  }

  get creditCandidates () {
    return this.members.filter(i => i.uid !== this.creditor)
  }

  get debtCandidates () {
    return this.members.filter(i => i.uid !== this.debtor)
  }
}
</script>

<style lang='sass'>
.transfer-form
  .arrow
    min-width: 120px
    position: relative

    .line
      background: grey
      height: 2px

    .point
      position: absolute
      right: -12px
      top: -3px
      border-top: 4px solid transparent
      border-right: 10px solid transparent
      border-bottom: 4px solid transparent
      border-left: 10px solid grey
</style>
