<template lang='pug'>
.splitting

  template(v-if='on === "debtors"')
    i18n(path='ui.splitting.total').total-fee
      app-money-label.mx-1.primary--text(
        :amount='trans.total_fee'
        :currency='trans.currency'
      )

    v-tabs.mode-switcher(
      v-model='tab' v-if='showTabs'
      slider-color='transparent' grow
    )
      v-tab(v-for='(mode, idx) in modes' :key='mode.mode' :class='tab==idx ? "primary--text" : ""' :ripple='false')
        v-icon(style='color:inherit;transition:none;').mr-1 {{mode.icon}}
        v-expand-x-transition
          span(v-show='tab==idx') {{mode.text}}

  //* ========== Average ========== *//
  .mode-average(v-show='mode==="average"')

    .tip {{$t('ui.splitting.mode_average_tip')}}

    app-member-toggles(
      :uids='participators.map(p=>p.uid)',
      :selected='participators.filter(p=>p.weight).map(p=>p.uid)',
      @select='uid=>toggleWeight(participators.find(p=>p.uid === uid))'
    )

    i18n(path='ui.splitting.mode_average_details').tips
      b.primary--text {{realParticipators.length}}

    app-money-label.mx-1.primary--text.average-amount(
      :amount='trans.total_fee / realParticipators.length'
      :currency='trans.currency'
    )

  //* ========== Amount ========== *//
  .mode-amount(v-show='mode==="amount"')
    .participators
      .participator(
        v-for='pa in participators'
        v-columns='"auto auto max-content"'
        :class='getParticipatorClass(pa)'
        @click='focusInput(pa, "amount")'
      )
        .user-info-section
          app-user-avatar(size='38' :id='pa.uid')
          span.user-name-text.mx-2
            i18n(:path='userTextI18nPath')
              app-user-info(:id='pa.uid')
          v-expand-x-transition
            v-btn.op-25.ma-0(
              v-show='removable && focused===pa.uid'
              @click='removeParticipator(pa.uid)'
              flat icon small)
              v-icon(size='20') mdi-close

        template(v-if='participators.length > 1')
          app-number-input.ma-0.pa-0(
            :ref='`amount_input_${pa.uid}`'
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

  //* ========== Percent ========== *//
  .mode-percent(v-show='mode==="percent"')
    .px-4.pb-2(v-columns='"auto 1fr max-content"')
      template(v-for='pa in participators')
        .user-info-section.text-xs-center.pt-2
          app-user-avatar(size='38' :id='pa.uid' :show-name='true')

        v-slider.mt-0.px-3(
          v-model='pa.percent'
          @change='value => updatePercent(pa, value)'
          always-dirty
          :color='(pa.locked || pa.percent === 0) ? "primary" : "grey"'
          :min='0'
          :max='100'
          thumb-label hide-details
        )

        .text-xs-right(v-rows='"1fr min-content min-content 1fr"')
          div
          div
            b(style='font-size:1.1em') {{pa.percent}}%
            app-money-label.op-50(
              :amount='trans.total_fee * pa.percent / 100'
              :currency='trans.currency'
              style='font-size:0.9em;margin-top: -5px;display: block;')
          div

  //* ========== Weight ========== *//
  .mode-weight(v-if='mode==="weight"')
    .participators
      .participator(
        v-for='pa in participators'
        v-columns='"max-content max-content auto max-content"'
        :class='getParticipatorClass(pa)'
        @click='focusInput(pa, "weight")'
      )
        .user-info-section
          app-user-avatar(size='38' :id='pa.uid')
          app-user-info.user-name-text.mx-2(:id='pa.uid')

        .mx-1(v-rows='"1fr max-content 1fr"')
          div
          app-money-label.op-50(
            :amount='trans.total_fee * pa.weight / totalWeights'
            :currency='trans.currency'
          )
          div

        .grid-fill-width-right
          app-number-input.ma-0.pa-0(
            :ref='`weight_input_${pa.uid}`'
            :value='pa.weight'
            placeholder='0'
            @user-input='v => pa.weight = v'
            hide-details reverse flat hide-label
            rounded disable-operators
            style='padding-top: 5px !important;'
          )
        .currency / {{totalWeights}}

</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import { TransactionBalanceChanges, TransactionWeightsHelper, Splitmode } from '~/core'
import { Transaction, Member, Weight } from '~/types'
import NumberInput from '../basic/NumberInput.vue'

@Component
export default class Splitting extends Vue {
  @Prop(Object) readonly trans!: Transaction
  @Prop({ default: 'debtors' }) readonly on!: 'debtors' | 'creditors'
  @Prop({ default: true }) readonly showTabs!: boolean
  @Prop({ default: () => [] }) readonly members!: Member[]
  @Prop({ default: 'average' }) readonly mode!: Splitmode

  focused: string|null = null

  get modes() {
    return [
      { mode: 'average', icon: 'mdi-account-multiple', text: this.$t('ui.splitting.average') },
      { mode: 'amount', icon: 'mdi-currency-usd', text: this.$t('ui.splitting.amount') },
      { mode: 'percent', icon: 'mdi-percent', text: this.$t('ui.splitting.percent') },
      { mode: 'weight', icon: 'mdi-scale-balance', text: this.$t('ui.splitting.weight') },
    ]
  }

  get tab() {
    for (let i = 0; i < this.modes.length; i++) {
      if (this.modes[i].mode === this.mode)
        return i
    }
    return 0
  }

  set tab(value) {
    this.$emit('update:mode', this.modes[+value].mode)
  }

  get currency() {
    return this.trans.currency
  }

  get removable() {
    return this.participators.length > 1 && this.on === 'creditors'
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

  get helper() {
    return new TransactionWeightsHelper(this.trans, this.on)
  }

  get flexibleWeights() {
    return this.helper.flexibleWeights
  }

  get fixedFees() {
    return this.helper.fixedFees
  }

  get flexibleFees() {
    return this.helper.flexibleFees
  }

  get userTextI18nPath() {
    if (this.on === 'creditors')
      return 'ui.xx_paid_money'
    return 'utils.bypass_1'
  }

  get totalWeights() {
    return this.helper.totalWeights
  }

  @Watch('trans')
  onTransitionChanged() {
    this.initMode()
  }

  @Watch('mode')
  onModeChanged() {
    this.$emit('mode-changed', this.mode)
    // close keyboard
    this.focused = null
    this.$emit('keyboard', null)
    this.initMode()
  }

  initMode() {
    if (this.mode === 'percent') {
      const total = this.participators.map(p => p.weight || 0).reduce((a, b) => a + b, 0)
      this.participators.forEach((p) => {
        this.$set(p, 'percent', Math.round((p.weight || 0) / total * 100 || 0))
      })
    }
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
    return this.helper.getFee(participator)
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

  updatePercent(participator: Weight, value: number) {
    value = Math.min(value, 100)
    this.$set(participator, 'locked', true)
    let unlocked = this.participators.filter(p => !p.locked)
    if (unlocked.length === 0) {
      unlocked = this.participators.filter(p => p !== participator)
      unlocked.forEach(w => this.$set(w, 'locked', false))
    }
    const lockedTotal = this.participators
      .filter(p => p !== participator && p.locked)
      .map(p => p.percent || 0)
      .reduce((a, b) => a + b, 0)
    const fromTotal = unlocked
      .map(p => p.percent || 0)
      .reduce((a, b) => a + b, 0)
    const toTotal = 100 - lockedTotal - value
    if (toTotal < 0) {
      this.participators
        .filter(p => p !== participator)
        .forEach(w => this.$set(w, 'locked', false))
      return this.updatePercent(participator, value)
    }
    const scale = toTotal / fromTotal
    unlocked.forEach((p) => {
      p.percent = (p.percent || 0) * scale
      if (isNaN(p.percent))
        p.percent = toTotal / unlocked.length
    })
  }

  getParticipatorClass(participator: Weight) {
    if (this.participators.length <= 1)
      return
    if (this.focused === participator.uid)
      return 'raised'
  }

  focusInput(participator: Weight, mode: string) {
    this.focused = participator.uid
    const fee_input = this.$refs[`${mode}_input_${participator.uid}`] as NumberInput[]
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

  public cleanUp(removeZero: boolean) {
    this.helper.cleanUp(this.mode, removeZero)
  }
}
</script>

<style lang='stylus'>
.splitting
  overflow-y auto

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

  .mode-amount, .mode-percent, .mode-weight
    .participators
      padding 0 1em

      .participator
        padding 0.5em 0.7em
        margin 0.2em 0
        transition all .3s ease-in-out
        border-radius 8px
        border 2px solid transparent

        &.raised
          border-color var(--theme-primary)

        & > *,
        .user-info-section > *
          vertical-align middle

        .user-info-section
          white-space nowrap

        &.add
          cursor pointer

    .v-slider, .v-slider input
      max-height inherit
      height 65px

  .mode-average
    text-align center
    padding 2em 1.5em

    .tip
      font-size 1.1em

    .average-amount
      display block
      margin 0.5em
      font-size 1.4em

  .currency
    opacity 0.4
    font-size 0.8em
    padding-left 4px
    margin-top 13px
</style>
