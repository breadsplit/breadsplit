<template lang='pug'>
.splitting
  .participators
    .participator(v-for='pa in participators', v-columns='"auto 80px"')
      div
        app-user-avatar(size='38' :id='pa.uid' show-name inline)
        span.ml-2 {{$t('ui.paid_money')}}
        v-btn.op-25(
          v-if='participators.length > 1'
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
import sum from 'lodash/sum'
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

  clear() {
    this.participators.forEach((p) => {
      this.$delete(p, 'fee')
    })
  }

  setParticipator(uid: string) {
    this.participators = [{ weight: 1, uid }]
  }

  addParticipator(uid: string) {
    if (this.participators.length === 1)
      this.participators[0].fee = this.trans.total_fee
    this.participators.push({ weight: 0, uid })
  }

  removeParticipator(uid: string) {
    this.participators = this.participators.filter(c => c.uid !== uid)
  }

  getFee(creditor: Weight) {
    if (creditor.fee)
      return creditor.fee
    let weights = sum(this.participators.filter(c => c.fee == null).map(i => i.weight || 0))
    const fees = sum(this.participators.filter(c => c.fee != null).map(i => i.fee || 0))
    if (!weights)
      weights = 1
    return ((creditor.weight || 0) / weights) * (this.trans.total_fee - fees)
  }

  setFee(creditor: Weight, fee: number) {
    if (fee === this.getFee(creditor))
      return
    creditor.fee = +fee
    this.trans.total_fee = sum(this.participators.map(i => i.fee || 0))
    // this.gcd()
  }

  gcd() {
    const participators = this.participators.map(c => ({
      uid: c.uid,
      fee: this.getFee(c),
    }))
    const gcd = GCD(participators.map(c => c.fee))
    this.participators.forEach((c) => {
      const participator = participators.find(d => d.uid === c.uid)
      if (!participator || !participator.fee)
        c.weight = 0
      else
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
