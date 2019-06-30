<template lang='pug'>
.page-container.height-100
  .header {{$t('ui.newtrans.details')}}

  v-card.pa-3.ma-2
    app-receipt-list(:items='receipt_items' :currency='form.currency')
      template(v-slot:item='{ item }')
        div
          app-user-avatar.py-1.px-2(:id='item.value' size='24')
          app-user-info(:id='item.value')

  v-text-field.px-2.pt-3.description-field(
    v-model='form.desc'
    label='$t("ui.newtrans.description")'
    placeholder='Some expense...'
    solo required hide-details
  )

  app-category-select(@input='i=> form.category = i' :categories='categories')
    template(v-slot='{on}' )
      div.ml-2(v-on='on' v-columns='"40px auto"' v-ripple)
        app-category-icon(:category='form.category')
        v-subheader
          app-category-label(:category='form.category')

  div.ml-2(v-columns='"40px auto"' @click='pickDate()' v-ripple)
    v-icon(color='grey') mdi-calendar
    v-subheader {{dateDisplay}}

  div.ml-2(v-columns='"40px auto"')
    v-icon(color='grey') mdi-map-marker
    v-subheader {{$t('ui.newtrans.add_location')}}

  div.ml-2(v-columns='"40px auto"')
    v-icon(color='grey') mdi-history
    v-subheader {{$t('ui.newtrans.repeat_expense')}}

  .mt-2

  exchange-rate-input(ref='exchange' :form='form')
  app-date-picker(ref='date_picker')
</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import Categories from '~/../meta/categories'
import { Transaction } from '~/types'
import DatePicker from '~/components/basic/DatePicker.vue'
import { TransactionWeightsHelper } from '~/core'
import { dateToRelative } from '~/../utils/formatters'
import ExchangeRateInput from './ExchangeRateInput.vue'
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

  get dateDisplay() {
    return dateToRelative(this.form.timestamp, this.$t.bind(this))
  }

  async pickDate() {
    const date = await this.$refs.date_picker.open(this.form.timestamp)
    if (date)
      this.form.timestamp = date
  }

  get receipt_items() {
    const creditors = new TransactionWeightsHelper(this.form, 'creditors')
    const debtors = new TransactionWeightsHelper(this.form, 'debtors')
    const positive = creditors.participators.map(p => ({ amount: creditors.getFee(p, 'weight'), value: p.uid }))
    const negative = debtors.participators.map(p => ({ amount: -debtors.getFee(p, 'weight'), value: p.uid }))
    return [...positive, null, ...negative]
  }
}
</script>
