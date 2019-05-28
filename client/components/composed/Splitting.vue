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

  .participators
    .participator(v-for='pa in participators', v-columns='"auto 80px"')
      div
        app-user-avatar(size='38' :id='pa.uid' show-name inline)
        span.ml-2 {{$t('ui.paid_money')}}
        v-btn.op-25(
          v-if='participators.length > 1 && removable'
          @click='removeParticipator(pa.uid)'
          flat icon small)
          v-icon(size='20') mdi-close

        span ({{pa.weight}})

      app-number-input.ma-0.pa-0(
        v-if='participators.length > 1'
        :value='getFee(pa)'
        placeholder='0'
        @focus='e=>$emit("keyboard", e)'
        @user-input='v=>setFee(pa,v)'
        hide-details reverse
      )

    .participator.add(v-if='candidates.length')
      app-member-select(:members='candidates', @input='id=>addParticipator(id)')
        app-user-avatar(size='38' show-name inline)
          v-icon(size='24') mdi-plus
          span(slot='text') {{$t('ui.newtrans.more_payers')}}

</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { TransactionBalanceChanges, GCD } from '~/core'
import { Transaction, Member, Weight } from '~/types'

type Splitmode = 'average' | 'amount' | 'percent' | 'weight'

@Component
export default class Splitting extends Vue {
  tab = 0

  @Prop(Object) readonly trans!: Transaction
  @Prop({ default: 'debtors' }) readonly on!: 'debtors' | 'creditors'
  @Prop({ default: true }) readonly showTabs!: boolean
  @Prop({ default: () => [] }) readonly members!: Member[]

  get splitmode(): Splitmode {
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

  get removable() {
    return this.on === 'creditors'
  }

  get balanceChanges() {
    return TransactionBalanceChanges(this.trans)
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
    return ((participator.weight || 0) / (this.flexibleWeights || 1)) * (this.flexibleFees)
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

  setFee(participator: Weight, fee: number) {
    if (fee === this.getFee(participator))
      return
    this.$set(participator, 'fee', +fee || 0)
    this.recalculateTotal()
    // this.trans.total_fee = sum(this.participators.map(i => i.fee || 0))
    // this.gcd()
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
      if (participator && participator.fee)
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
    padding 0 2em 0 2em

    .participator
      padding 0.5em 0

      & > *
        vertical-align middle

      .add
        cursor pointer

</style>
