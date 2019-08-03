<template lang='pug'>
.page-container.height-100.pa-0.mt-n4.overflow-y-auto.overflow-x-hidden

  v-carousel(
    v-if='form.attached_images && form.attached_images.length'
    :show-arrows='false'
    hide-delimiter-background
    height='250'
  )
    v-carousel-item(v-for='src in form.attached_images' :key='src')
      v-img(:src='src' height='250' @click='overlayImage = script')
      v-icon(color='white' @click='removeImage(i)' v-if='editing').close-btn mdi-close

  .pa-4
    div(v-columns='"max-content auto"')
      div
        v-menu(transition='slide-y-transition' offset-y v-model='showCategorySelect')
          template(v-slot:activator='{ on }')
            .category-wrapper.pr-2(v-on='on')
              template(v-if='form.category')
                app-category-item(:category='parseCategory(form.category)' color)
              template(v-else)
                .category-empty
                  v-icon(size='28') mdi-tag-multiple
          v-card.py-3.px-5(width='400px')
            app-category-select.mx-n3(v-model='form.category')

      v-text-field.description-field(
        v-model='form.desc'
        :placeholder='editing ? $t("ui.transactions.description_placeholder") : parseCategory(form.category).text'
        :readonly='!editing'
        :class='{"flat": !editing}'
        :rounded='editing'
        style='margin: auto 0'
        solo
        required
        hide-details
      )

  v-divider

  .pa-4
    div.ml-2(v-columns='"40px auto"' @click='pickDate()' v-ripple='editing')
      v-icon(color='grey') mdi-calendar
      v-subheader {{dateDisplay}}

    div.ml-2(v-columns='"40px auto"' v-if='editing')
      v-icon(color='grey') mdi-map-marker
      v-subheader {{$t('ui.transactions.add_location')}}

    // div.ml-2(v-columns='"40px auto"')
      v-icon(color='grey') mdi-history
      v-subheader {{$t('ui.transactions.repeat_expense')}}

    // ===== Uploading =====
    template(v-if='group.online')
      template(v-if='uploadingImage')
        div.ml-2(v-columns='"40px auto"')
          .px-2.py-3
            v-progress-circular(indeterminate color='grey' size='22' width='2.5')
          v-subheader {{$t('ui.transactions.photos_uploading')}}

      template(v-else-if='editing')
        app-file-upload(@change='onFileChanged' multiple)
          div.ml-2(v-columns='"40px auto"')
            v-icon(color='grey') mdi-camera
            v-subheader {{$t('ui.transactions.add_photos')}}

    exchange-rate-input(ref='exchange' :form='form')

  v-divider

  .px-6.py-8
    app-receipt-list(:items='receiptItems' :currency='form.currency')
      template(v-slot:item='{ item }')
        div
          app-user-avatar.py-1.px-2(:id='item.value' size='24')
          app-user-info(:id='item.value')

  app-date-picker(ref='date_picker')
  v-overlay(:value='overlayImage').photo-overlay
    v-btn(icon @click='overlayImage = null').close-btn
      v-icon(color='white') mdi-close

    img(:src='overlayImage' @click='overlayImage = null' style='max-height: 100vh; max-width: 100vw')
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
  @Prop(Boolean) readonly editing!: boolean

  uploadingImage = false
  overlayImage: string | null = null
  showCategorySelect = false

  $refs!: {
    date_picker: DatePicker
    exchange: ExchangeRateInput
  }

  get dateDisplay () {
    return dateToRelative(this.form.timestamp, this.$t.bind(this))
  }

  get receiptItems () {
    const creditors = new TransactionWeightsHelper(this.form, 'creditors')
    const debtors = new TransactionWeightsHelper(this.form, 'debtors')
    const positive = creditors.participators
      .map(p => ({ amount: creditors.getFee(p), value: p.uid }))
      .filter(i => i.amount)
    const negative = debtors.participators
      .map(p => ({ amount: -debtors.getFee(p), value: p.uid }))
      .filter(i => i.amount)
    return [...positive, null, ...negative]
  }

  async pickDate () {
    if (!this.editing)
      return
    const date = await this.$refs.date_picker.open(this.form.timestamp)
    if (date)
      this.form.timestamp = date
  }

  openCategorySelect () {
    if (!this.form.category)
      this.showCategorySelect = true
  }

  async onFileChanged (files: File | File[]) {
    if (!Array.isArray(files))
      files = [files]
    if (files.length === 0)
      return

    this.uploadingImage = true
    try {
      const urls = await Promise.all(files.map((f, i) => this.$fire.uploadImage(this.group.id, this.form.id, f)))
      this.form.attached_images = (this.form.attached_images || []).concat(urls)
    }
    catch (e) {
      console.error(e)
    }
    this.uploadingImage = false
  }

  removeImage (i: number) {
    if (this.form.attached_images)
      this.form.attached_images.splice(i, 1)
  }
}
</script>

<style lang="sass">
.page-container
  .v-carousel
    .close-btn
      position: absolute
      top: 8px
      right: 8px

  .category-wrapper
    min-width: 60px
    text-align: center

  .category-empty
    width: 55px
    height: 55px
    border-radius: 50%
    border: 1.5px dashed rgba(125, 125, 125, 0.3)
    text-align: center
    display: grid

    .v-icon
      opacity: 0.2
      padding-top: 2px
      margin: auto

  .photo-overlay
    .close-btn
      position: fixed
      top: 8px
      right: 8px
</style>
