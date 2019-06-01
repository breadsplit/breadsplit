<template lang='pug'>
.splitting

  i18n(path='ui.splitting.total').total-fee
    app-money-label.mx-1.primary--text(
      :amount='trans.total_fee'
      :currency='trans.currency'
    )

  template(v-if='on === "debtors"')
    v-tabs.mode-switcher(v-model='tab' v-if='showTabs' slider-color='transparent' grow)
      v-tab(:class='tab == 0 ? "primary--text" : ""' :ripple='false')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-account-multiple
        v-expand-x-transition
          span(v-show='tab === 0') {{$t('ui.splitting.average')}}

      v-tab(:class='tab == 1 ? "primary--text" : ""' :ripple='false')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-currency-usd
        v-expand-x-transition
          span(v-show='tab === 1') {{$t('ui.splitting.amount')}}

      v-tab(:class='tab == 2 ? "primary--text" : ""' :ripple='false')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-percent
        v-expand-x-transition
          span(v-show='tab === 2') {{$t('ui.splitting.percent')}}

      v-tab(:class='tab == 3 ? "primary--text" : ""' :ripple='false')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-scale-balance
        v-expand-x-transition
          span(v-show='tab === 3') {{$t('ui.splitting.weight')}}

  .mode-average(v-if='mode==="average"')

    .tip {{$t('ui.splitting.mode_average_tip')}}

    .participators

      .participator(
        v-for='pa in participators'
      )
        app-icon-merge(@click.native='toggleWeight(pa)')
          app-user-avatar.op-ani(size='48' :id='pa.uid' :class='{"op-50": !pa.weight}')
          v-scale-transition(slot='append')
            v-avatar.elevation-1(v-show='pa.weight' size='22' color='primary')
              v-icon(color='white' size='15') mdi-check

    i18n(path='ui.splitting.mode_average_details').tips
      b.primary--text {{realParticipators.length}}

    app-money-label.mx-1.primary--text.average-amount(
      :amount='trans.total_fee / realParticipators.length'
      :currency='trans.currency'
    )

  .mode-amount(v-if='mode==="amount"')
    .participators
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

  get realParticipators() {
    return this.trans[this.on].filter(p => p.weight)
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

  toggleWeight(participator: Weight) {
    if (participator.weight) {
      // should at leasest be one people left
      if (this.realParticipators.length > 1)
        participator.weight = 0
    }
    else {
      participator.weight = 1
    }
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

.splitting

  .total-fee
    font-size 1.1em
    padding 1em 2em

  .mode-switcher
    margin 0.8em 1.8em

    .v-tabs__item
      white-space nowrap

    .v-tabs__item--active
      position relative !important
      span
        color var(--theme-primary)

    .v-tabs__item--active:before
      content ""
      background var(--theme-primary)
      opacity 0.13
      border-radius 5px
      position absolute
      top 5px
      bottom 5px
      left 5px
      right 5px

  .mode-amount
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

  .mode-average
    text-align center
    padding 2em 1.5em

    .tip
      font-size 1.1em

    .average-amount
      display block
      margin 0.5em
      font-size 1.4em

    .participators
      padding 1em 2em

      .participator
        padding 0.5em
        display inline-block

  .currency
    opacity 0.4
    font-size 0.8em
    padding-left 4px
    margin-top 15px
</style>
