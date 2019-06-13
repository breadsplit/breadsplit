<template lang='pug'>
.page-container
  .header {{$t('ui.newtrans.more_details')}}

  v-text-field.px-2.py-3.description-field(
    v-model='form.desc'
    label='Description'
    placeholder='Some expense...'
    solo required hide-details
  )

  app-category-select.ml-2(@input='i=> form.category = i' :categories='categories')
    template(v-slot='{on}' )
      div(v-on='on' v-columns='"40px auto"' v-ripple)
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

  div.ml-2(v-columns='"40px auto"' v-if='isDifferentCurrency')
    v-icon(color='grey') mdi-swap-horizontal-bold
    v-subheader
      exchange-rate-input(:form='form')

  app-date-picker(ref='date_picker')
</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import Categories from '~/../meta/categories'
import { Transaction } from '~/types'
import DatePicker from '~/components/basic/DatePicker.vue'
import { dateToRelative } from '~/core'
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
  }

  next() {
    this.$emit('next')
  }

  get dateDisplay() {
    return dateToRelative(this.form.timestamp, this.$t.bind(this))
  }

  async pickDate() {
    const date = await this.$refs.date_picker.open(this.form.timestamp)
    if (date)
      this.form.timestamp = date
  }

  get isDifferentCurrency() {
    return this.form.currency !== this.group.main_currency
  }
}
</script>
