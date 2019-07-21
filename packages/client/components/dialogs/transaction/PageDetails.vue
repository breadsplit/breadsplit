<template lang='pug'>
.page-container.height-100
  .header {{$t('ui.newtrans.details')}}

  v-card.pa-3.ma-2
    app-receipt-list(:items='receipt_items' :currency='form.currency')
      template(v-slot:item='{ item }')
        div
          app-user-avatar.py-1.px-2(:id='item.value' size='24')
          app-user-info(:id='item.value')

  template(v-for='cat in categories')
    app-action-with-text.option.pa-2.px-3(v-ripple @click.native='form.category = cat.name')
      app-category-icon(
        slot='action'
        :active='form.category === cat.name '
        :category='cat.name',
        size='32'
      )
      app-category-label(
        slot='text'
        :active='form.category === cat.name '
        :category='cat.name'
      )

  v-text-field.px-2.pt-1.pb-1.description-field(
    v-model='form.desc'
    label='$t("ui.newtrans.description")'
    placeholder='Some expense...'
    solo required hide-details
  )

  div.ml-2(v-columns='"40px auto"' @click='pickDate()' v-ripple)
    v-icon(color='grey') mdi-calendar
    v-subheader {{dateDisplay}}

  div.ml-2(v-columns='"40px auto"')
    v-icon(color='grey') mdi-map-marker
    v-subheader {{$t('ui.newtrans.add_location')}}

  // div.ml-2(v-columns='"40px auto"')
    v-icon(color='grey') mdi-history
    v-subheader {{$t('ui.newtrans.repeat_expense')}}

  .mt-2

  exchange-rate-input(ref='exchange' :form='form')
  app-date-picker(ref='date_picker')
</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import ExchangeRateInput from './ExchangeRateInput.vue'
import Categories from '~/../meta/categories'
import { Transaction } from '~/types'
import DatePicker from '~/components/basic/DatePicker.vue'
import { TransactionWeightsHelper } from '~/core'
import { dateToRelative } from '~/../utils/formatters'
import { GroupMixin } from '~/mixins'

@Component({
  components: {
    ExchangeRateInput,
  },
})
export default class PageDetails extends mixins(GroupMixin) {
  @Prop(Object) readonly form!: Transaction

  categories = Categories

  $refs!: {
    date_picker: DatePicker
    exchange: ExchangeRateInput
  }

  get dateDisplay () {
    return dateToRelative(this.form.timestamp, this.$t.bind(this))
  }

  async pickDate () {
    const date = await this.$refs.date_picker.open(this.form.timestamp)
    if (date)
      this.form.timestamp = date
  }

  get receipt_items () {
    const creditors = new TransactionWeightsHelper(this.form, 'creditors')
    const debtors = new TransactionWeightsHelper(this.form, 'debtors')
    const positive = creditors.participators
      .map(p => ({ amount: creditors.getFee(p, 'weight'), value: p.uid }))
      .filter(i => i.amount)
    const negative = debtors.participators
      .map(p => ({ amount: -debtors.getFee(p, 'weight'), value: p.uid }))
      .filter(i => i.amount)
    return [...positive, null, ...negative]
  }
}
</script>
