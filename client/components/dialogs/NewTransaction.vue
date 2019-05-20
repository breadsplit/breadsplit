<template lang='pug'>
mixin inputs()
  .my-2.mx-3(v-columns='"auto 65px"' style='vertical-align:bottom')
    app-number-input(
      ref='total_fee_input'
      v-model.number='form.total_fee'
      placeholder='0'
      @focus='openKeyboard'
      reverse outline autofocus
      required hide-details flat='true' main='true'
    )
    div(v-rows='"auto 45px"')
      span
      app-currency-select.mt-0.pt-0(v-model='form.currency')

  app-soft-numpad(ref='numpad')

v-card.new-transaction(v-rows='"max-content auto max-content"')
  app-dialog-bar(@close='close()')
    | {{$t('ui.new_expense')}}

  v-window.height-100(v-model='step', touchless)
    // First page
    v-window-item(:value='1')
      div.height-100(v-rows='"auto max-content"')
        .vertical-aligned.ma-4
          template(v-if='form.creditors.length === 1')
            app-member-select(:members='members', v-model='form.creditors[0].uid')
          span.mr-2 {{$t('ui.paid_money')}}

        div
          +inputs()

    // Second page
    v-window-item(:value='2')
      .my-3
        div(v-columns='"max-content auto"')
          app-category-select.pl-3(
            :value='form.category || categorySense',
            @input='i=> form.category = i'
            :categories='cats'
          )
          v-text-field.pr-3.description-field(
            v-model='form.desc' label='Description' placeholder='Some expense...' solo required)

        v-divider
        div(v-columns='"70px auto"')
          v-icon(color='primary') mdi-cash-usd
          app-splitting(:trans='form' on='creditors' :show-tabs='false')
            v-subheader(slot='header') {{$t('ui.paid_by')}}

        v-divider
        div(v-columns='"70px auto"')
          v-icon(color='primary') mdi-chart-pie
          app-splitting(:trans='form' on='debtors')
            v-subheader(slot='header') {{$t('ui.splitting.split_by')}}

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

      template(v-if='step === 1')
        v-btn.button-quick-add(:disabled='!form.total_fee', color='primary', flat, @click='submit')
          | {{$t('ui.button_quick_add')}}

        v-btn.button-next-step(:disabled='!form.total_fee', color='primary', depressed, @click='step++')
          | {{$t('ui.button_next')}}

      template(v-if='step === 2')
        v-btn.button-save(:disabled='step === 3', color='primary', depressed, @click='submit')
          | {{$t('ui.button_save')}}

    app-date-picker(ref='datePicker')
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import Categories, { CategoryKeys } from '~/meta/categories'
import { GroupMixin, DialogChildMixin, CommonMixin } from '~/mixins'
import { Transaction, Weight } from '~/types'
import { TransactionDefault, dateToRelative } from '~/core'

@Component
export default class NewTransaction extends Mixins(GroupMixin, CommonMixin, DialogChildMixin) {
  form: Transaction = TransactionDefault()
  cats = Categories
  step = 1

  reset() {
    this.$set(this, 'form', TransactionDefault())
    const me = this.options.uid || (this.members[0] || {}).id // TODO: get my id
    this.form.creator = me
    this.form.currency = this.group.currencies[0]
    this.form.creditors.push({ weight: 1, uid: me })
    this.form.debtors = this.members.map((m): Weight => ({ weight: 1, uid: m.id }))
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

  get dateDisplay() {
    return dateToRelative(this.form.timestamp, this.$t.bind(this))
  }

  get categorySense() {
    const category = this.categoriesKeywords
      .find(({ key, value }) => {
        return (this.form.desc || '').toLowerCase().includes(key)
      })
    return (category && category.value) || null
  }

  submit() {
    const trans = Object.assign({},
      this.form, {
        category: this.form.category || this.categorySense,
      })
    this.$store.dispatch('group/newTranscation', { id: this.group.id, trans })
    this.close()
  }

  openKeyboard(e) {
    // @ts-ignore
    this.$refs.total_fee_input.registerKeyboard(this.$refs.numpad)
  }

  async pickDate() {
    // @ts-ignore
    const date: number | null = await this.$refs.datePicker.open(this.form.timestamp)
    if (date)
      this.form.timestamp = date
  }
}
</script>

<style lang='stylus' scoped>
.new-trans-form
  overflow-x hidden
</style>
