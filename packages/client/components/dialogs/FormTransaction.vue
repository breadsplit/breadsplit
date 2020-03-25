<template lang='pug'>
v-card.form-transaction(v-rows='"max-content auto max-content"')
  app-composed-toolbar(:height='navHeight' dark color='primary')
    v-btn(icon @click='close')
      v-icon mdi-close
    v-toolbar-title
      | {{title}}
      span(v-if='mode==="edit"').pl-1.em-08.op-75 {{$t('ui.transaction.editing_note')}}
    v-spacer
    template(v-if='!hasError')
      v-btn(icon @click='promptRemove' v-if='mode==="edit" || mode==="view"')
        v-icon mdi-delete
      v-btn(icon @click='mode = "edit"' v-if='mode==="view"')
        v-icon mdi-pencil
      // v-btn.mr-n2(icon @click='submit' v-if='mode!=="view"' :disabled='!form.total_fee')
        v-icon mdi-check

    template(v-slot:content)
      div(style='margin-left: 72px; margin-top: -10px' v-if='!hasError')
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
    // Fee Page
    v-window-item.page
      page-splitting(
        ref='splitting_creditors'
        :form='form'
        :members='members'
        :allow-add='!solo'
        on='creditors'
      )

    // Spliting Page
    v-window-item.page
       page-splitting(
        ref='splitting_debtors'
        :form='form'
        :members='members'
        on='debtors'
      )

    // Transfer Page
    v-window-item.page
      page-transfer(ref='transfer' :form='form')

    // Details Page
    v-window-item.page
      page-details(ref='details' :form='form' :editing='editing' @uploading='i => uploadingImage = i')

    // Special page
    v-window-item.page
      template(v-if='error === "not_found"')
        app-empty-placeholder(
          icon='alert-octagon-outline'
          :desc='$t("ui.transactions.not_found")'
        )
          v-btn(color='primary' text @click='reset')
            | {{$t('ui.button_retry')}}
          v-btn(color='primary' text @click='close')
            | {{$t('ui.button_cancel')}}

      template(v-else-if='error === "await"')
        app-empty-placeholder(
          :title='$t("ui.transactions.syncing")'
          :desc='$t("ui.transactions.syncing_desc")'
        )
          template(v-slot:icon)
            v-progress-circular(indeterminate size='84' width='2').op-25.ma-3
          v-btn(color='primary' text @click='reset')
            | {{$t('ui.button_retry')}}
          v-btn(color='primary' text @click='close')
            | {{$t('ui.button_cancel')}}

  div(v-show='editing')
    v-divider
    v-card-actions.pa-3
      v-breadcrumbs(:items='stepItems' large :disabled='btnNextDisabled')
        template(v-slot:divider='')
          v-icon mdi-chevron-right
        template(v-slot:item='{ item }')
          v-breadcrumbs-item(
            @click.native='step = item.href'
            :disabled='btnNextDisabled'
            :class='{ active: step === item.href }'
            color
          ) {{item.text}}

      v-spacer

      template(v-if='step != 3')
        v-btn.button-quick-add.px-4(:disabled='!form.total_fee', color='primary', text, @click='submit')
          | {{$t('ui.button_finish')}}

      template(v-if='mode==="edit"')
        v-btn.button-quick-add.px-4(color='grey', text, @click='close')
          | {{$t('ui.button_cancel')}}

      v-btn.button-next.px-4(color='primary', depressed, @click='btnNext', :disabled='btnNextDisabled')
        | {{btnNextText}}

</template>

<script lang='ts'>
import { Component, mixins, Getter, Watch } from 'nuxt-property-decorator'
import cloneDeep from 'lodash/cloneDeep'
import { oc } from 'ts-optchain'
import { TransactionHelper } from '../../../core'
import PageDetails from './transaction/PageDetails.vue'
import PageSplitting from './transaction/PageSplitting.vue'
import PageTransfer from './transaction/PageTransfer.vue'
import { GroupMixin, DialogChildMixin, CommonMixin } from '~/mixins'
import { Transaction, Weight } from '~/types'
import { TransactionDefault, IdMe, defaultCurrency } from '~/core'

const STEP_INPUT = 0
const STEP_SPLIT = 1
const STEP_TRANSFER = 2
const STEP_DETAIL = 3
const STEP_ERROR = 4

type Mode = 'create' | 'edit' | 'view'
type ErrorType = null | 'not_found' | 'await'

@Component({
  components: {
    PageDetails,
    PageSplitting,
    PageTransfer,
  },
})
export default class FormTransaction extends mixins(GroupMixin, CommonMixin, DialogChildMixin) {
  form: Transaction = TransactionDefault()
  step = STEP_INPUT
  mode: Mode = 'create'
  error: ErrorType = null
  solo = false
  uploadingImage = false

  $refs!: {
    splitting_creditors: PageSplitting
    splitting_debtors: PageSplitting
    details: PageDetails
  }

  @Getter('user/uid') uid: string | undefined

  get editing() {
    return this.mode !== 'view'
  }

  reset() {
    if (this.$refs.details)
      this.$refs.details.reset()
    this.uploadingImage = false
    this.solo = false
    this.error = null

    if (!this.options.transid)
      return this.initCreate()

    // enter view mode when transid is provided
    const trans = this.group.transactions.find(i => i.id === this.options.transid)
    if (trans)
      return this.initView(trans)

    // transaction may not synced yet, show loading screen
    if (this.options.await && this.isOnline) {
      // TODO: update when synced
      return this.initError('await')
    }

    // transaction not found
    return this.initError('not_found')
  }

  initView(trans: Transaction) {
    this.$set(this, 'form', cloneDeep(trans))
    this.error = null
    this.mode = this.options.mode === 'edit' ? 'edit' : 'view'
    this.fulfillDebtors()
    this.step = STEP_DETAIL
  }

  initError(error: ErrorType) {
    this.$set(this, 'form', TransactionDefault())
    this.mode = 'view'
    this.error = error
    this.step = STEP_ERROR
  }

  initCreate() {
    this.$set(this, 'form', TransactionDefault())
    this.mode = 'create'
    this.error = null
    this.solo = !!this.options.solo

    let me = IdMe
    if (this.uid && this.uid in this.group.members)
      me = this.uid
    this.form.type = this.options.type || 'expense'
    this.form.creator = me
    this.form.currency = this.group.main_currency || defaultCurrency
    this.form.category = this.options.category

    this.step = this.stepItems[0].href

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
    else if (this.form.type === 'transfer') {
      this.form.debtors = []
    }
    else {
      this.form.debtors = this.members.map((m): Weight => ({ weight: 1, uid: m.uid || IdMe }))
    }

    if (this.form.type === 'transfer') {
      this.form.category = 'transfer'

      // make sure there is only one debtor and creditor
      this.form.debtors = this.form.debtors.slice(0, 1)
      this.form.creditors = this.form.creditors.slice(0, 1)

      if (this.form.total_fee && this.form.debtors.length)
        this.step = STEP_DETAIL
    }

    if (this.options.solo)
      this.updateSolo()
  }

  get type() {
    return this.form.type || 'expense'
  }

  get title() {
    if (this.mode === 'view') {
      if (this.form.type === 'transfer')
        return this.$t('ui.transactions.view_transfer')
      else
        return this.$t('ui.transactions.view_expense')
    }

    switch (this.step) {
      case STEP_INPUT:
        return this.$t('ui.transactions.how_much')
      case STEP_SPLIT:
        return this.$t('ui.splitting.split_by')
      case STEP_TRANSFER:
        return this.$t('ui.transactions.transfer')
      default:
        return this.$t('ui.transactions.details')
    }
  }

  get hasError() {
    return !!this.error
  }

  get navHeight() {
    return this.hasError ? 56 : 85
  }

  cleanUp() {
    TransactionHelper.from(this.form).cleanUp()
  }

  fulfillDebtors() {
    const debtorIds = this.form.debtors.map(d => d.uid)
    this.form.debtors.push(
      ...this.members.filter(m => m.uid && !debtorIds.includes(m.uid))
        .map(m => ({ weight: 0, percent: 0, uid: m.uid || IdMe })),
    )
  }

  next() {
    const steps = this.stepItems
    const len = steps.length
    for (let i = 0; i < len - 1; i++) {
      if (steps[i].href === this.step) {
        this.step = steps[i + 1].href
        break
      }
    }
    if (this.step === STEP_SPLIT && this.solo)
      this.step = STEP_DETAIL
  }

  get stepItems() {
    if (this.type === 'transfer') {
      return [
        {
          text: this.$t('ui.transactions.how_much_short'),
          disabled: false,
          href: STEP_TRANSFER,
        },
        {
          text: this.$t('ui.transactions.details_short'),
          disabled: false,
          href: STEP_DETAIL,
        }]
    }
    else if (this.type === 'expense') {
      return [{
        text: this.$t('ui.transactions.how_much_short'),
        disabled: false,
        href: STEP_INPUT,
      },
      {
        text: this.$t('ui.splitting.split_by_short'),
        disabled: false,
        href: STEP_SPLIT,
      },
      {
        text: this.$t('ui.transactions.details_short'),
        disabled: false,
        href: STEP_DETAIL,
      }]
    }
    else {
      return [{
        text: this.$t('ui.transactions.details_short'),
        disabled: false,
        href: STEP_DETAIL,
      }]
    }
  }

  @Watch('step')
  onStepChanged(value, oldvalue) {
    if (oldvalue === STEP_INPUT)
      this.$refs.splitting_creditors.finishUp()
    if (oldvalue === STEP_SPLIT)
      this.$refs.splitting_debtors.finishUp()
    if (value === STEP_DETAIL && this.type !== 'transfer')
      setTimeout(() => this.$refs.details.openCategorySelect(), 500)
  }

  btnNext() {
    if (this.btnNextDisabled)
      return
    if (this.step !== STEP_DETAIL)
      return this.next()
    else
      this.submit()
  }

  calc() {
    oc(this).$refs.splitting_creditors.$refs.numpad.calculate()
  }

  @Watch('form.creditors', { deep: true })
  updateSolo() {
    if (!this.solo)
      return
    this.form.debtors.forEach((m) => {
      if (m.uid !== this.form.creditors[0].uid)
        m.weight = 0
      else
        m.weight = 1
    })
  }

  get btnNextText() {
    if (this.step === STEP_DETAIL) {
      if (this.uploadingImage)
        return this.$t('ui.button_image_uploading')
      if (this.mode === 'create')
        return this.$t('ui.button_create')
      else
        return this.$t('ui.button_save')
    }

    return this.$t('ui.button_next')
  }

  get btnNextDisabled() {
    return !this.form.total_fee || this.form.debtors.length === 0 || this.uploadingImage
  }

  submit() {
    this.cleanUp()
    const trans = this.form
    if (this.mode === 'create')
      this.$store.dispatch('group/newTransaction', { id: this.group.id, trans })
    else if (this.mode === 'edit')
      this.$store.dispatch('group/editTransaction', { id: this.group.id, trans })
    this.close()
  }

  async promptRemove() {
    const result = await this.$root.$confirm(
      this.$t('prompt.confirm_transaction_removal_title'),
      this.$t('prompt.confirm_transaction_removal'),
    )
    if (result) {
      this.$store.dispatch('group/removeTransaction', { id: this.group.id, transid: this.form.id })
      this.close()
    }
  }

  mounted() {
    if (module && module.hot)
      this.reset()
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
