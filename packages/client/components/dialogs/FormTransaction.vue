<template lang='pug'>
v-card.form-transaction(v-rows='"max-content auto max-content"')
  app-composed-toolbar(height='85' dark color='primary')
    v-btn(icon @click='close')
      v-icon mdi-close
    v-toolbar-title {{title}}
    v-spacer
    v-btn(icon @click='promptRemove' v-if='mode==="edit"')
      v-icon mdi-delete
    v-btn(icon @click='mode = "edit"' v-if='mode==="view"')
      v-icon mdi-pencil
    v-btn.mr-n2(icon @click='submit' :disabled='!form.total_fee')
      v-icon mdi-check

    template(v-slot:content)
      div(style='margin-left: 72px; margin-top: -10px')
        .sub-toolbar-title
          template(v-if='step === 0')
            span {{$t('ui.transactions.enter_the_cost')}}
          template(v-else)
            i18n(path='ui.splitting.total').total-fee
              b
                app-money-label.mx-1(
                  :amount='form.total_fee'
                  :currency='form.currency'
                )

  v-window.grid-fill-height.form(v-model='step' touchless)
    v-window-item.page
      page-splitting(
        ref='splitting_creditors'
        :form='form'
        :members='members'
        on='creditors'
      )

    v-window-item.page
       page-splitting(
        ref='splitting_debtors'
        :form='form'
        :members='members'
        on='debtors'
      )

    v-window-item.page
      page-details(ref='details' :form='form' @next='next' :editing='editing')

  div(v-show='editing')
    v-divider
    v-card-actions.pa-3
      v-breadcrumbs(:items='stepItems' large)
        template(v-slot:divider='')
          v-icon mdi-chevron-right
        template(v-slot:item='{ item }')
          v-breadcrumbs-item(
            @click.native='step = item.href'
            :disabled='btnNextDisabled'
            :class='{ active: step === item.href }'
          ) {{item.text}}

      v-spacer

      template(v-if='step != 2')
        v-btn.button-quick-add.px-4(:disabled='!form.total_fee', color='primary', text, @click='submit')
          | {{$t('ui.button_finish')}}

      v-btn.button-next.px-4(color='primary', depressed, @click='btnNext', :disabled='btnNextDisabled')
        | {{btnNextText}}

</template>

<script lang='ts'>
import { Component, mixins, Getter, Watch } from 'nuxt-property-decorator'
import cloneDeep from 'lodash/cloneDeep'
import { oc } from 'ts-optchain'
import { TransactionHelper } from '../../../core'
import PageCreditors from './transaction/PageCreditors.vue'
import PageDetails from './transaction/PageDetails.vue'
import PageSplitting from './transaction/PageSplitting.vue'
import { GroupMixin, DialogChildMixin, CommonMixin } from '~/mixins'
import { Transaction, Weight } from '~/types'
import { TransactionDefault, IdMe, defaultCurrency } from '~/core'

const STEP_INPUT = 0
const STEP_SPLIT = 1
const STEP_DETAIL = 2

type Mode = 'create' | 'edit' | 'view'

@Component({
  components: {
    PageCreditors,
    PageDetails,
    PageSplitting,
  },
})
export default class FormTransaction extends mixins(GroupMixin, CommonMixin, DialogChildMixin) {
  form: Transaction = TransactionDefault()
  step = STEP_INPUT
  mode: Mode = 'create'

  $refs!: {
    splitting_creditors: PageSplitting
    splitting_debtors: PageSplitting
    details: PageDetails
  }

  @Getter('user/uid') uid: string | undefined

  get editing () {
    return this.mode !== 'view'
  }

  reset () {
    if (this.options.transid) {
      const trans = this.group.transactions.find(i => i.id === this.options.transid)
      if (trans)
        return this.open(trans)
    }
    this.create()
  }

  open (trans: Transaction) {
    this.$set(this, 'form', cloneDeep(trans))
    this.step = STEP_DETAIL
    this.mode = this.options.mode === 'edit' ? 'edit' : 'view'
    this.fulfillDebtors()
  }

  create () {
    this.$set(this, 'form', TransactionDefault())
    this.step = STEP_INPUT
    this.mode = 'create'

    let me = IdMe
    if (this.uid && this.uid in this.group.members)
      me = this.uid
    this.form.type = this.options.type || 'expense'
    this.form.creator = me
    this.form.currency = this.group.main_currency || defaultCurrency
    this.form.category = this.options.category

    if (this.options.from) {
      this.form.creditors = this.options.from
        .toString()
        .split(',')
        .map(uid => ({ weight: 1, uid }))
    }
    else {
      this.form.creditors.push({ weight: 1, uid: me })
    }

    if (this.options.amount) {
      this.form.total_fee = +this.options.amount || 0
      // move to next step
      if (this.form.total_fee && this.step === STEP_INPUT)
        this.step = STEP_SPLIT
    }

    if (this.options.to) {
      this.form.debtors = this.options.to
        .toString()
        .split(',')
        .map(uid => ({ weight: 1, uid }))
      // move to next step
      if (this.step === STEP_SPLIT)
        this.step = STEP_DETAIL
    }
    else {
      this.form.debtors = this.members.map((m): Weight => ({ weight: 1, uid: m.uid || IdMe }))
    }
  }

  get title () {
    if (this.step === STEP_INPUT)
      return this.$t('ui.transactions.how_much')
    if (this.step === STEP_SPLIT)
      return this.$t('ui.splitting.split_by')
    return this.$t('ui.transactions.details')
  }

  cleanUp () {
    TransactionHelper.from(this.form).cleanUp()
    oc(this).$refs.details.$refs.exchange.save(() => '')()
  }

  fulfillDebtors () {
    const debtorIds = this.form.debtors.map(d => d.uid)
    this.form.debtors.push(
      ...this.members.filter(m => m.uid && !debtorIds.includes(m.uid))
        .map(m => ({ weight: 0, percent: 0, uid: m.uid || IdMe }))
    )
  }

  next () {
    this.step++
  }

  get stepItems () {
    return [{
      text: this.$t('ui.transactions.how_much_short'),
      disabled: false,
      href: 0,
    },
    {
      text: this.$t('ui.splitting.split_by_short'),
      disabled: false,
      href: 1,
    },
    {
      text: this.$t('ui.transactions.details_short'),
      disabled: false,
      href: 2,
    }]
  }

  @Watch('step')
  onStepChanged (value, oldvalue) {
    if (oldvalue === 2)
      this.$refs.splitting_creditors.finishUp()
    if (oldvalue === 3)
      this.$refs.splitting_debtors.finishUp()
  }

  btnNext () {
    if (this.btnNextDisabled)
      return
    if (this.step === STEP_INPUT && this.uncalculated)
      return this.calc()
    if (this.step !== STEP_DETAIL)
      return this.next()
    this.submit()
  }

  calc () {
    oc(this).$refs.splitting_creditors.$refs.numpad.calculate()
  }

  // TODO: update
  uncalculated = false

  get btnNextText () {
    if (this.step === STEP_INPUT && this.uncalculated) {
      return this.$t('ui.button_calculate')
    }
    else if (this.step === STEP_DETAIL) {
      if (this.mode === 'create')
        return this.$t('ui.button_create')
      else
        return this.$t('ui.button_save')
    }

    return this.$t('ui.button_next')
  }

  get btnNextDisabled () {
    return this.step === STEP_INPUT && !this.form.total_fee
  }

  submit () {
    this.cleanUp()
    const trans = this.form
    if (this.mode === 'create')
      this.$store.dispatch('group/newTransaction', { id: this.group.id, trans })
    else if (this.mode === 'edit')
      this.$store.dispatch('group/editTransaction', { id: this.group.id, trans })
    this.close()
  }

  async promptRemove () {
    const result = await this.$root.$confirm(
      this.$t('prompt.confirm_transaction_removal_title'),
      this.$t('prompt.confirm_transaction_removal'),
    )
    if (result)
      this.remove()
  }

  remove () {
    this.$store.dispatch('group/removeTransaction', { id: this.group.id, transid: this.form.id })
    this.close()
  }
}
</script>

<style lang='sass'>
.form-transaction
  overflow-x: hidden

  .page
    min-height: 400px
    height: 100%
    padding-top: 16px

    & > .height-100
      min-height: 400px

  .v-breadcrumbs
    padding: 2px 0 0 5px

    .v-breadcrumbs__divider
      padding: 0

    li
      padding: 5px 8px
      opacity: 0.6

      &.active
        color: var(--theme-primary)
        opacity: 1

  .sub-toolbar-title
    font-size: 0.95em
    opacity: 0.9

  .page-container
    padding: 1em 1.5em 0.5em 1.5em

    .member-choices
      text-align: center
      padding: 2em 0

      .user-avatar
        padding: 0.7em
        cursor: pointer

  .form
    min-height: 550px

.v-dialog--fullscreen
  .form-transaction
    height: 100%
    .form
      min-height: 0
</style>
