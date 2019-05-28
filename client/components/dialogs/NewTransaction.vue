<template lang='pug'>
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
      app-splitting-page(
        :trans='form'
        :members='members'
        :title='$t("ui.newtrans.how_much")'
        on='creditors'
      )

    v-window-item.page(:value='3')
       app-splitting-page(
        :trans='form'
        :members='members'
        :title='$t("ui.newtrans.for_whom")'
        on='debtors'
      )

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

    app-date-picker(ref='date_picker')
</template>

<script lang='ts'>
import { Component, mixins, Getter } from 'nuxt-property-decorator'
import Categories, { CategoryKeys } from '~/../meta/categories'
import { GroupMixin, DialogChildMixin, CommonMixin } from '~/mixins'
import { Transaction, Weight } from '~/types'
import { TransactionDefault, dateToRelative, IdMe, defaultCurrency } from '~/core'
import DatePicker from '../basic/DatePicker.vue'

@Component
export default class NewTransaction extends mixins(GroupMixin, CommonMixin, DialogChildMixin) {
  form: Transaction = TransactionDefault()
  cats = Categories
  step = 1
  steps = 4

  $refs!: {
    date_picker: DatePicker
  }

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

  setCreditor(uid: string) {
    this.form.creditors = [{ weight: 1, uid }]
    this.next()
  }

  next() {
    this.step++
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

  async pickDate() {
    const date: number | null = await this.$refs.date_picker.open(this.form.timestamp)
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
    padding 1.5em 2em 0.5em 2em

    .header
      font-size 2.5em

    .subheader
      font-size 1.3em

    .member-choices
      padding 1.5em 0

      .user-avatar
        padding 0.7em
        cursor pointer
</style>
