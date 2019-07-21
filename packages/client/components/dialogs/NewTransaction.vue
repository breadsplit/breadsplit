<template lang='pug'>
v-card.new-transaction(v-rows='"auto max-content"')
  app-close-button(@close='close')

  v-window.grid-fill-height(v-model='step' touchless style='min-height:550px')
    v-window-item.page
      page-splitting(
        ref='splitting_creditors'
        :form='form'
        :members='members'
        :title='$t("ui.newtrans.how_much")'
        on='creditors'
      )

    v-window-item.page
       page-splitting(
        ref='splitting_debtors'
        :form='form'
        :members='members'
        :title='$t("ui.splitting.split_by")'
        on='debtors'
      )

    v-window-item.page
      page-details(ref='details' :form='form', @next='next')

  div
    v-divider
    v-card-actions.pa-3
      template(v-if='step === 0')
        v-btn.button-cancel.px-4(text, @click='close')
          | {{$t('ui.button_cancel')}}

      template(v-else)
        v-btn.button-back.px-4(text, @click='step--')
          | {{$t('ui.button_back')}}

      v-spacer

      template(v-if='step >= 1')
        v-btn.button-quick-add.px-4(:disabled='!form.total_fee', color='primary', text, @click='submit')
          | {{$t('ui.button_finish')}}

      v-btn.button-next.px-4(color='primary', depressed, @click='btnNext', :disabled='btnNextDisabled')
        | {{btnNextText}}

</template>

<script lang='ts'>
import { Component, mixins, Getter, Watch } from 'nuxt-property-decorator'
import PageCreditors from './transaction/PageCreditors.vue'
import PageDetails from './transaction/PageDetails.vue'
import PageSplitting from './transaction/PageSplitting.vue'
import { GroupMixin, DialogChildMixin, CommonMixin } from '~/mixins'
import { Transaction, Weight } from '~/types'
import { TransactionDefault, IdMe, defaultCurrency } from '~/core'

const STEP_INPUT = 0
const STEP_SPLIT = 1
const STEP_DETAIL = 2

@Component({
  components: {
    PageCreditors,
    PageDetails,
    PageSplitting,
  },
})
export default class NewTransaction extends mixins(GroupMixin, CommonMixin, DialogChildMixin) {
  form: Transaction = TransactionDefault()
  step = STEP_INPUT

  $refs!: {
    splitting_creditors: PageSplitting
    splitting_debtors: PageSplitting
    details: PageDetails
  }

  @Getter('user/uid') uid: string | undefined

  reset () {
    this.form = TransactionDefault()
    this.step = STEP_INPUT

    let me = IdMe
    if (this.uid && this.uid in this.group.members)
      me = this.uid
    this.form.type = this.options.type || 'expense'
    this.form.creator = me
    this.form.currency = this.group.main_currency || defaultCurrency

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

  cleanUp () {
    this.$refs.splitting_creditors.$refs.splitting.cleanUp(true)
    this.$refs.splitting_debtors.$refs.splitting.cleanUp(true)
    this.$refs.details.$refs.exchange.save()
  }

  next () {
    this.step++
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
    if (this.step !== STEP_DETAIL)
      return this.next()
    this.submit()
  }

  get btnNextText () {
    if (this.step === STEP_DETAIL)
      return this.$t('ui.button_save')

    return this.$t('ui.button_next')
  }

  get btnNextDisabled () {
    return this.step === STEP_INPUT && !this.form.total_fee
  }

  submit () {
    this.cleanUp()
    const trans = this.form
    this.$store.dispatch('group/newTranscation', { id: this.group.id, trans })
    this.close()
  }
}
</script>

<style lang='sass'>
.v-dialog--fullscreen
  .new-transaction
    height: 100%

.new-transaction
  overflow-x: hidden

  .page
    min-height: 400px
    height: 100%

    & > .height-100
      min-height: 400px

  .page-container
    padding: 1.5em 2em 0.5em 2em

    .header
      font-size: 2.5em

    .subheader
      font-size: 1.3em

    .member-choices
      text-align: center
      padding: 2em 0

      .user-avatar
        padding: 0.7em
        cursor: pointer
</style>
