<template lang='pug'>
.page-container.height-100.pa-0.mt-n4.overflow-y-auto.overflow-x-hidden

  template(v-if='form.attached_images && form.attached_images.length')
    v-carousel(
      v-model='carouselIndex'
      :show-arrows='false'
      :hide-delimiters='form.attached_images.length <= 1'
      delimiter-icon='mdi-circle-medium'
      hide-delimiter-background
      height='250'
    )
      v-carousel-item(v-for='src, index in form.attached_images' :key='index')
        v-img(:src='src' height='250' @click='overlayImage = src')
          template(v-slot:placeholder)
            v-layout(fill-height align-center justify-center ma-0).grey.op-50
              v-progress-circular(indeterminate color='grey lighten-5')
        v-icon(color='white' @click='removeImage(index)' v-if='editing').close-btn mdi-close

    v-divider

  .pa-4
    div(v-columns='"max-content auto"')
      div(style='height:60px')
        v-menu(
          v-model='showCategorySelect'
          :disabled='!editing || form.type === "transfer"'
          transition='slide-y-transition'
        )
          template(v-slot:activator='{ on }')
            .category-wrapper.pr-2(v-on='on')
              template(v-if='form.category')
                app-category-item(:category='parseCategory(form.category)' color :clickable='editing')
              template(v-else)
                .category-empty
                  v-icon(size='28') mdi-tag-multiple
          v-card.py-5.px-5(width='380px')
            div.primary--text.ml-2.mb-2 {{$t('ui.transactions.select_category')}}
            app-category-select.mx-n3(v-model='form.category' @input='focus()' allow-create @create='showCreateForm')

      v-text-field.description-field(
        ref='desc'
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
    .form-field-item(@click='pickDate()' v-ripple='editing')
      v-icon mdi-calendar
      .text {{ dateDisplay }}

    .form-field-item(@click='inputNote()' v-if='editing || form.note' v-ripple='editing')
      v-icon mdi-tooltip-text-outline
      pre.text {{ form.note || $t('ui.transactions.add_note')}}

    // .form-field-item(v-if='editing')
      v-icon(color='grey') mdi-map-marker
      .text {{$t('ui.transactions.add_location')}}

    // div.ml-2(v-columns='"40px auto"')
      v-icon(color='grey') mdi-history
      v-subheader {{$t('ui.transactions.repeat_expense')}}

    // ===== Uploading =====
    template(v-if='group.online')
      template(v-if='uploadingImage')
        .form-field-item
          .px-2.py-3
            v-progress-circular(indeterminate color='grey' size='22' width='2.5')
          .text {{$t('ui.transactions.photos_uploading')}}

      template(v-else-if='editing')
        app-file-upload(@change='onFileChanged' multiple)
          .form-field-item
            v-icon mdi-camera
            .text {{$t('ui.transactions.add_photos')}}

    exchange-rate-input(ref='exchange' :form='form' :editing='editing')

  v-divider

  .px-2.py-4
    transfer-form.pb-3.pt-4(v-if='form.type === "transfer"' :form='form' disabled)
    app-transaction-sheet.pb-1(v-else :transaction='form' dense hide-empty)

  template(v-if='!editing')
    v-divider
    .px-6.py-4.history-info
      .pa-1
        v-icon.mr-3 mdi-shape-square-plus
        i18n(path='ui.transactions.created_by')
          span
            app-user-avatar.py-1.px-2(:id='form.creator' size='24')
            app-user-info(:id='form.creator' bold)
          b {{dateToRelative(form.timestamp_created)}}

      .pa-1(v-if='form.modifier')
        v-icon.mr-3 mdi-square-edit-outline
        i18n(path='ui.transactions.modified_by', )
          span
            app-user-avatar.py-1.px-2(:id='form.modifier' size='24')
            app-user-info(:id='form.modifier' bold)
          b {{dateToRelative(form.timestamp_modified)}}

  app-date-picker(ref='date_picker')
  app-form-category(ref='form_category')

  v-overlay(:value='overlayImage').photo-overlay
    v-btn(icon @click='overlayImage = null').close-btn
      v-icon(color='white') mdi-close

    img(:src='overlayImage' @click='overlayImage = null' style='max-height: 100vh; max-width: 100vw')

</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import FormCategory from '../FormCategory.vue'
import ExchangeRateInput from './ExchangeRateInput.vue'
import TransferForm from './TransferForm.vue'
import DatePicker from '~/components/basic/DatePicker.vue'
import { Transaction } from '~/types'
import { TransactionWeightsHelper } from '~/core'
import { dateFromNow } from '~/utils'
import { GroupMixin, CommonMixin } from '~/mixins'

@Component({
  components: {
    ExchangeRateInput,
    TransferForm,
  },
})
export default class PageDetails extends mixins(GroupMixin, CommonMixin) {
  @Prop(Object) readonly form!: Transaction
  @Prop(Boolean) readonly editing!: boolean

  uploadingImage = false
  overlayImage: string | null = null
  showCategorySelect = false
  carouselIndex = 0

  $refs!: {
    date_picker: DatePicker
    exchange: ExchangeRateInput
    form_category: FormCategory
  }

  reset() {
    this.carouselIndex = 0
    this.uploadingImage = false
    this.overlayImage = null
    this.$emit('uploading', this.uploadingImage)
  }

  get dateDisplay() {
    return dateFromNow(this.form.timestamp, this.currentLocale)
  }

  get receiptItems() {
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

  async pickDate() {
    if (!this.editing)
      return
    const date = await this.$refs.date_picker.open(this.form.timestamp)
    if (date)
      this.form.timestamp = +this.$dt(date).add(1, 'day').subtract(1, 'minute')
  }

  async inputNote() {
    if (!this.editing)
      return
    const note = await this.$prompt(this.$t('ui.transactions.note'), this.form.note || '', { textarea: true })
    this.$set(this.form, 'note', note)
  }

  dateToRelative(v) {
    return dateFromNow(v, this.currentLocale)
  }

  openCategorySelect() {
    if (!this.form.category)
      this.showCategorySelect = true
  }

  async onFileChanged(files: File | File[]) {
    if (!Array.isArray(files))
      files = [files]
    if (files.length === 0)
      return

    this.uploadingImage = true
    this.$emit('uploading', this.uploadingImage)
    try {
      const urls = await Promise.all(files.map((f, i) => this.$fire.uploadImage(this.group.id, this.form.id, f)))
      this.form.attached_images = (this.form.attached_images || []).concat(urls)
    }
    catch (e) {
      console.error(e)
    }
    this.uploadingImage = false
    this.$emit('uploading', this.uploadingImage)
  }

  removeImage(i: number) {
    if (this.form.attached_images) {
      this.form.attached_images.splice(i, 1)
      this.carouselIndex = this.form.attached_images.length - 1
      this.$nextTick(() => this.carouselIndex = 0)
    }
  }

  focus() {
    // @ts-ignore
    this.$refs.desc.focus()
  }

  async showCreateForm() {
    const cat = await this.$refs.form_category.open()
    if (cat)
      this.form.category = cat.id
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

    .v-btn--fab.v-size--small
      height: 30px
      width: 30px

      &.v-btn--active:before
        opacity: 0.1

  .category-wrapper
    min-width: 70px
    min-height: 55px
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

.form-field-item
  margin-left: 8px
  display: grid
  grid-template-columns: 40px auto

  .v-icon
    color: #9e9e9e

  .text
    opacity: 0.5
    align-items: center
    display: flex
    min-height: 48px
    font-size: 0.875rem
    font-weight: 400
    padding: 8px 16px
    white-space: pre-line

.history-info
  font-size: 0.9em
  .v-icon
    opacity: 0.8
</style>
