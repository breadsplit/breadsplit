<template lang='pug'>
.splitting

  template(v-if='on === "debtors"')
    v-tabs.mx-2(v-model='tab', v-if='showTabs', slider-color='transparent' grow)
      v-tab(:class='tab == 0 ? "primary--text" : ""')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-account-multiple
        v-expand-x-transition
          span(v-show='tab === 0') {{$t('ui.splitting.average')}}

      v-tab(:class='tab == 1 ? "primary--text" : ""')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-currency-usd
        v-expand-x-transition
          span(v-show='tab === 1') {{$t('ui.splitting.amount')}}

      v-tab(:class='tab == 2 ? "primary--text" : ""')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-percent
        v-expand-x-transition
          span(v-show='tab === 2') {{$t('ui.splitting.percent')}}

      v-tab(:class='tab == 3 ? "primary--text" : ""')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-scale-balance
        v-expand-x-transition
          span(v-show='tab === 3') {{$t('ui.splitting.weight')}}

    v-divider.mb-3

  .participators(v-if='mode==="amount"')
    .participator(
      v-for='pa in participators'
      v-columns='"auto auto max-content"'
      :class='getParticipatorClass(pa)'
      @click='focusInput(pa)'
    )
      .user-info-section
        app-user-avatar(size='38' :id='pa.uid')
        span.user-name-text.mx-2
          i18n(:path='userTextI18nPath')
            b
              app-user-info(:id='pa.uid')
        v-expand-x-transition
          v-btn.op-25.ma-0(
            v-show='removable && focused===pa.uid'
            @click='removeParticipator(pa.uid)'
            flat icon small)
            v-icon(size='20') mdi-close

        //span ({{pa.weight}})

      template(v-if='participators.length > 1')
        app-number-input.ma-0.pa-0(
          :ref='`fee_input_${pa.uid}`'
          :value='getFee(pa)'
          placeholder='0'
          @user-input='v=>setFee(pa,v)'
          hide-details reverse flat hide-label
          style='padding-top: 5px !important;'
        )
        .currency {{currency}}

    .participator.add.px-1(v-if='candidates.length')
      app-member-select(:members='candidates', @input='id=>addParticipator(id)')
        v-btn(icon small).op-50
          v-icon(size='24') mdi-plus
        span {{$t('ui.newtrans.add_payer')}}

</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import { TransactionBalanceChanges, GCD } from '~/core'
import { Transaction, Member, Weight } from '~/types'
import NumberInput from '../basic/NumberInput.vue'

type Splitmode = 'average' | 'amount' | 'percent' | 'weight'

@Component
export default class Splitting extends Vue {
  tab = 0

  @Prop(Object) readonly trans!: Transaction
  @Prop({ default: 'debtors' }) readonly on!: 'debtors' | 'creditors'
  @Prop({ default: true }) readonly showTabs!: boolean
  @Prop({ default: () => [] }) readonly members!: Member[]

  focused: string|null = null

  get mode(): Splitmode {
    if (this.on === 'creditors')
      return 'amount'

    switch (this.tab) {
      case 0:
        return 'average'
      case 1:
        return 'amount'
      case 2:
        return 'percent'
      default:
        return 'weight'
    }
  }

  get currency() {
    return this.trans.currency
  }

  get removable() {
    return this.on === 'creditors'
  }

  get balanceChanges() {
    return TransactionBalanceChanges(this.trans)
  }

  get participators() {
    return this.trans[this.on]
  }

  set participators(value: Weight[]) {
    this.trans[this.on] = value
  }

  get participatorIds() {
    return this.participators.map(c => c.uid)
  }

  get candidates() {
    return this.members.filter(m => m.uid != null && !this.participatorIds.includes(m.uid))
  }

  get flexibleWeights() {
    return this.participators
      .filter(c => c.fee == null)
      .map(i => i.weight || 0)
      .reduce((a, b) => a + b, 0)
  }

  get fixedFees() {
    return this.participators
      .filter(c => c.fee != null)
      .map(i => i.fee || 0)
      .reduce((a, b) => a + b, 0)
  }

  get flexibleFees() {
    return this.trans.total_fee - this.fixedFees
  }

  get userTextI18nPath() {
    if (this.on === 'creditors')
      return 'ui.xx_paid_money'
    return 'utils.bypass_1'
  }

  @Watch('mode')
  onModeChanged() {
    this.$emit('mode-changed', this.mode)
    // close keyboard
    this.focused = null
    this.$emit('keyboard', null)
  }

  getRecord(uid: string) {
    return this.trans[this.on]
      .find(d => d.uid === uid)
  }

  getBalance(uid) {
    return this.balanceChanges
      .find(d => d.uid === uid)
  }

  getAmount(uid: string) {
    const balance = this.getBalance(uid)
    if (!balance)
      return 0
    if (this.on === 'debtors')
      return -balance.debt
    if (this.on === 'creditors')
      return balance.credit
  }

  setParticipator(uid: string, weight = 1) {
    this.participators = [{ weight, uid }]
  }

  addParticipator(uid: string, weight = 1) {
    this.participators.push({ weight, uid })
  }

  removeParticipator(uid: string) {
    this.participators = this.participators.filter(c => c.uid !== uid)
  }

  getFee(participator: Weight) {
    if (participator.fee != null)
      return participator.fee
    if (!this.flexibleWeights)
      return 0
    return ((participator.weight || 0) / (this.flexibleWeights || 1)) * (this.flexibleFees)
  }

  setFee(participator: Weight, fee: number) {
    if (fee === this.getFee(participator))
      return
    this.$set(participator, 'fee', +fee || 0)
    this.recalculateTotal()
  }

  setWeight(participator: Weight, weight: number) {
    participator.weight = weight
  }

  getParticipatorClass(participator: Weight) {
    if (this.participators.length <= 1)
      return ['elevation-0']
    if (this.focused === participator.uid)
      return ['raised', 'elevation-4']
    return ['elevation-0']
  }

  focusInput(participator: Weight) {
    this.focused = participator.uid
    const fee_input = this.$refs[`fee_input_${participator.uid}`] as NumberInput[]
    if (fee_input && fee_input[0])
      this.$emit('keyboard', fee_input[0])
  }

  recalculateTotal() {
    if (this.fixedFees > this.trans.total_fee || !this.flexibleWeights)
      this.trans.total_fee = this.fixedFees
  }

  public clear() {
    this.participators.forEach((p) => {
      this.$delete(p, 'fee')
    })
  }

  public gcd() {
    const participators = this.participators.map(c => ({
      uid: c.uid,
      fee: this.getFee(c),
    }))
    const gcd = GCD(participators.map(c => c.fee))
    this.participators.forEach((c) => {
      const participator = participators.find(d => d.uid === c.uid)
      if (participator && participator.fee != null)
        c.weight = participator.fee / gcd
    })
  }
}
</script>

<style lang='stylus'>
.v-tabs__item
  white-space nowrap

.splitting
  .participators
    padding 0 1em

    .participator
      padding 0.5em 1em
      margin 0.2em 0
      transition all .3s ease-in-out
      border-radius 5px

      & > *,
      .user-info-section > *
        vertical-align middle

      .user-info-section
        white-space nowrap

      &.add
        cursor pointer

  .currency
    opacity 0.4
    font-size 0.8em
    padding-left 4px
    margin-top 15px
</style>
