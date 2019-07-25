<template lang='pug'>
.page-container.height-100.pb-0.overflow-y-auto

  v-text-field.mb-2.description-field(
    v-model='form.desc'
    :placeholder='$t("ui.newtrans.description_placeholder")'
    solo required hide-details
  )

  app-category-select.mx-n3(v-model='form.category' :group='group')

  v-divider.my-3

  div.ml-2(v-columns='"40px auto"' @click='pickDate()' v-ripple)
    v-icon(color='grey') mdi-calendar
    v-subheader {{dateDisplay}}

  div.ml-2(v-columns='"40px auto"')
    v-icon(color='grey') mdi-map-marker
    v-subheader {{$t('ui.newtrans.add_location')}}

  // div.ml-2(v-columns='"40px auto"')
    v-icon(color='grey') mdi-history
    v-subheader {{$t('ui.newtrans.repeat_expense')}}

  exchange-rate-input(ref='exchange' :form='form')

  //v-card.ma-2.pa-3.mb-7
    app-receipt-list(:items='receipt_items' :currency='form.currency')
      template(v-slot:item='{ item }')
        div
          app-user-avatar.py-1.px-2(:id='item.value' size='24')
          app-user-info(:id='item.value')

  app-date-picker(ref='date_picker')
</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import ExchangeRateInput from './ExchangeRateInput.vue'
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
