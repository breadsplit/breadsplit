<template lang='pug'>
mixin inputs()
  .mx-3(v-columns='"max-content auto 65px"' style='vertical-align:bottom')
    div(v-rows='"auto max-content"')
      div
      .my-3.ml-2 {{$t('ui.total')}}
    app-number-input(
      ref='total_fee_input'
      v-model.number='form.total_fee'
      placeholder='0'
      @focus='openKeyboard'
      @click.native='gcdCredtors'
      reverse outline autofocus
      required hide-details flat main
    )
    div(v-rows='"auto 45px"')
      span
      app-currency-select.mt-0.pt-0(v-model='form.currency')

  app-soft-numpad(ref='numpad')

v-card.new-transaction(v-rows='"auto max-content"')
  app-close-button(@close='close')

  v-window.height-100(v-model='step', touchless)
    v-window-item.page(:value='1')
      .page-container
        .header {{$t('ui.newtrans.expense_paid_by')}}
        .subheader {{$t('ui.newtrans.xx_should_pay')}}

        .member-choices
          template(v-for='m in members')
            app-user-avatar(:id='m.uid' @click.native='setCreditor(m.uid)' :show-name='true')

    v-window-item.page(:value='2')
      .height-100(v-rows='"max-content auto max-content"')
        .page-container
          .header {{$t('ui.newtrans.how_much')}}

        .creditors
          .creditor(v-for='creditor in form.creditors', v-columns='"auto 80px"')
            div
              app-user-avatar(size='38' :id='creditor.uid' show-name inline)
              span.ml-2 {{$t('ui.paid_money')}}
              v-btn.op-25(
                v-if='form.creditors.length > 1'
                @click='removeCreditor(creditor.uid)'
                flat icon small)
                v-icon(size='20') mdi-close

              span ({{creditor.weight}})

            app-number-input.ma-0.pa-0(
              v-if='form.creditors.length > 1'
              :value='getCreditorFee(creditor)'
              placeholder='0'
              @focus='openKeyboard'
              @user-input='v=>setCreditorFee(creditor,v)'
              hide-details reverse
            )

          .creditor.add(v-if='creditorCandidates.length')
            app-member-select(:members='creditorCandidates', @input='id=>addCreditor(id)')
              app-user-avatar(size='38' show-name inline)
                v-icon(size='24') mdi-plus
                span(slot='text') {{$t('ui.newtrans.more_payers')}}

        div
          +inputs()

    v-window-item.page(:value='3')
      .page-container
        .header {{$t('ui.newtrans.for_whom')}}

        .member-choices
          template(v-for='m in members')
            app-user-avatar(:id='m.uid' @click.native='setCreditor(m.uid)' :show-name='true')

        app-splitting(:trans='form' on='debtors')
          v-subheader(slot='header') {{$t('ui.splitting.split_by')}}

    v-window-item.page(:value='4')
      .page-container
        .header {{$t('ui.newtrans.more_details')}}

        .mt-4(v-columns='"max-content auto"')
          app-category-select.pl-3(
            :value='form.category || categorySense',
            @input='i=> form.category = i'
            :categories='cats'
          )
          v-text-field.pr-3.description-field(
            v-model='form.desc' label='Description' placeholder='Some expense...' solo required)

        v-divider
        div(v-columns='"70px auto"' @click='pickDate()' v-ripple)
          v-icon(color='primary') mdi-calendar
          v-subheader {{dateDisplay}}

        v-divider
        div(v-columns='"70px auto"')
          v-icon(color='primary') mdi-map-marker
          v-subheader {{$t('ui.add_location')}}

        v-divider
        div(v-columns='"70px auto"')
          v-icon(color='primary') mdi-history
          v-subheader {{$t('ui.repeat_expense')}}

  div
    v-divider
    v-card-actions.pa-3
      template(v-if='step === 1')
        v-btn.button-cancel(flat, @click='close')
          | {{$t('ui.button_cancel')}}

      template(v-else)
        v-btn.button-back(flat, @click='step--')
          | {{$t('ui.button_back')}}

      v-spacer

      template(v-if='step >= 2')
        v-btn.button-quick-add(:disabled='!form.total_fee', color='primary', flat, @click='submit')
          | {{$t('ui.button_quick_add')}}

      v-btn.button-save(color='primary', depressed, @click='btnNext', :disabled='btnNextDisabled')
        | {{btnNextText}}

    app-date-picker(ref='datePicker')
</template>

<script lang='ts'>
import sum from 'lodash/sumBy'
import { Component, mixins, Getter } from 'nuxt-property-decorator'
import Categories, { CategoryKeys } from '~/../meta/categories'
import { GroupMixin, DialogChildMixin, CommonMixin } from '~/mixins'
import { Transaction, Weight } from '~/types'
import { TransactionDefault, dateToRelative, IdMe, GCD, defaultCurrency } from '~/core'

@Component
export default class NewTransaction extends mixins(GroupMixin, CommonMixin, DialogChildMixin) {
  form: Transaction = TransactionDefault()
  cats = Categories
  step = 1
  steps = 4

  @Getter('user/uid') uid: string | undefined

  reset() {
    this.form = TransactionDefault()
    let me = IdMe
    if (this.uid && this.uid in this.group.members)
      me = this.uid
    this.form.type = this.options.type || 'expense'
    this.form.creator = me
    this.form.currency = this.group.currencies[0] || defaultCurrency

    if (this.options.from) {
      this.form.creditors = this.options.from
        .toString()
        .split(',')
        .map(uid => ({ weight: 1, uid }))
    }
    else {
      this.form.creditors.push({ weight: 1, uid: me })
    }

    if (this.options.to) {
      this.form.debtors = this.options.to
        .toString()
        .split(',')
        .map(uid => ({ weight: 1, uid }))
    }
    else {
      this.form.debtors = this.members.map((m): Weight => ({ weight: 1, uid: m.uid || IdMe }))
    }

    this.form.total_fee = +this.options.amount || 0

    // @ts-ignore
    this.$refs.total_fee_input.inner_value = ''
    this.step = 1
  }

  get categoriesKeywords() {
    const keys: {key: string; value: string}[] = []
    CategoryKeys.map((c) => {
      const keywords = this.$t(`cats.${c}.keywords`, '').toString()
      for (const key of keywords.split(',').map(i => i.trim()).filter(i => i))
        keys.push({ key, value: c })
      return keywords
    })
    return keys
  }

  get categorySense() {
    const category = this.categoriesKeywords
      .find(({ key, value }) => {
        return (this.form.desc || '').toLowerCase().includes(key)
      })
    return (category && category.value) || null
  }

  get dateDisplay() {
    return dateToRelative(this.form.timestamp, this.$t.bind(this))
  }

  get creditorIds() {
    return this.form.creditors.map(c => c.uid)
  }

  get creditorCandidates() {
    return this.members.filter(m => m.uid != null && !this.creditorIds.includes(m.uid))
  }

  setCreditor(uid: string) {
    this.form.creditors = [{ weight: 1, uid }]
    this.next()
  }

  addCreditor(uid: string) {
    if (this.form.creditors.length === 1)
      this.form.creditors[0].fee = this.form.total_fee
    this.form.creditors.push({ weight: 0, uid })
  }

  removeCreditor(uid: string) {
    this.form.creditors = this.form.creditors.filter(c => c.uid !== uid)
  }

  getCreditorFee(creditor: Weight) {
    if (creditor.fee)
      return creditor.fee
    let weights = sum(this.form.creditors.filter(c => c.fee == null).map(i => i.weight || 0))
    const fees = sum(this.form.creditors.filter(c => c.fee != null).map(i => i.fee || 0))
    if (!weights)
      weights = 1
    return ((creditor.weight || 0) / weights) * (this.form.total_fee - fees)
  }

  setCreditorFee(creditor: Weight, fee: number) {
    if (fee === this.getCreditorFee(creditor))
      return
    creditor.fee = +fee
    this.form.total_fee = sum(this.form.creditors.map(i => i.fee || 0))
  }

  gcdCredtors() {
    const credtors = this.form.creditors.map(c => ({
      uid: c.uid,
      fee: this.getCreditorFee(c),
    }))
    const gcd = GCD(credtors.map(c => c.fee))
    this.form.creditors.forEach((c) => {
      const credtor = credtors.find(d => d.uid === c.uid)
      if (!credtor || !credtor.fee)
        c.weight = 0
      else
        c.weight = credtor.fee / gcd
      c.fee = undefined
    })
  }

  next() {
    this.step++
    if (this.step === 2) {
      this.$nextTick(() => {
        // @ts-ignore
        this.openKeyboard(this.$refs.total_fee_input)
      })
    }
  }

  btnNext() {
    if (this.btnNextDisabled)
      return
    if (this.step !== this.steps)
      return this.next()
    this.submit()
  }

  get btnNextText() {
    if (this.step === this.steps)
      return this.$t('ui.button_save')

    return this.$t('ui.button_next')
  }

  get btnNextDisabled() {
    return this.step === 2 && !this.form.total_fee
  }

  submit() {
    const trans = Object.assign({},
      this.form, {
        category: this.form.category || this.categorySense,
      })
    this.$store.dispatch('group/newTranscation', { id: this.group.id, trans })
    this.close()
  }

  registeredInput = null
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

  async pickDate() {
    // @ts-ignore
    const date: number | null = await this.$refs.datePicker.open(this.form.timestamp)
    if (date)
      this.form.timestamp = date
  }
}
</script>

<style lang='stylus'>
.v-dialog--fullscreen
  .new-transaction
    height 100%

    .page
      height 100%

.new-transaction
  overflow-x hidden

  .page
    min-height 400px

  .page-container
    padding 1.5em 2em

    .header
      font-size 2.5em

    .subheader
      font-size 1.4em

    .member-choices
      padding 1.5em 0

      .user-avatar
        padding 0.7em
        cursor pointer

  .creditors
    padding 0 2em 0 2em

    .creditor
      padding 0.5em 0

      .add
        cursor pointer

    .creditor > *
      vertical-align middle
</style>
