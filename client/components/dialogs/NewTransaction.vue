<template lang='pug'>
v-card.new-trans-form
  app-dialog-bar(@close='close()') New Expense

  .layout-relative.height-100
    v-window(v-model='step')

      // First page
      v-window-item(:value='1')
        v-container
          v-layout(column)
            v-flex.ma-2
              .vertical-aligned
                template(v-if='form.creditors.length === 1')
                  app-member-select(:members='members', v-model='form.creditors[0].uid')
                span.mr-2 paid

            v-flex.ma-2
              app-number-input(
                label='Total'
                ref='total_fee_input'
                v-model.number='form.total_fee'
                :prefix='form.currency'
                @focus='openKeyboard'
                reverse outline autofocus
                required hide-details
              )

      // Second page
      v-window-item(:value='2')
        .my-3
          app-form
            app-category-icon(:category='form.category || categorySense', label)
            v-text-field(
              v-model='form.desc' label='Description' placeholder='Some expense...' required)

          v-divider
          app-form
            v-icon(color='primary') mdi-cash-usd
            v-subheader Paid by

          v-divider
          app-form
            v-icon(color='primary') mdi-chart-pie
            app-splitting(:trans='form')

          v-divider
          app-form(@click.native='pickDate()', v-ripple)
            v-icon(color='primary') mdi-calendar
            v-subheader {{dateDisplay}}

          v-divider
          app-form
            v-icon(color='primary') mdi-map-marker
            v-subheader Add Location

          v-divider
          app-form
            v-icon(color='primary') mdi-history
            v-subheader Repeat

  app-absolute-placeholder(:salt='step')
    app-div.bottom-nav
      app-soft-numpad(v-if='step === 1' ref='numpad')
      v-divider
      v-card-actions.pa-3
        v-btn(v-show='step === 1', flat, @click='close')
          | {{$t('ui.button_cancel')}}

        v-btn(v-show='step !== 1', flat, @click='step--')
          | {{$t('ui.button_back')}}
        v-spacer

        template(v-if='step === 1')
          v-btn(:disabled='!form.total_fee', color='primary', flat, @click='submit')
            | {{$t('ui.button_quick_add')}}

          v-btn(:disabled='!form.total_fee', color='primary', depressed, @click='step++')
            | {{$t('ui.button_next')}}

        template(v-if='step === 2')
          v-btn(:disabled='step === 3', color='primary', depressed, @click='submit')
            | {{$t('ui.button_save')}}

  app-date-picker(ref='datePicker')
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator'
import Categories, { CategoryKeys } from '~/meta/categories'
import GroupMixin from '~/mixins/group'
import { Transaction, Weight } from '~/types'
import { TransactionDefault, relativeDate } from '~/core'

@Component
export default class NewTransaction extends Mixins(GroupMixin) {
  form: Transaction = TransactionDefault()
  cats = Categories
  step = 1

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
    return relativeDate(this.form.timestamp)
  }

  get categorySense() {
    const category = this.categoriesKeywords
      .find(({ key, value }) => {
        return (this.form.desc || '').toLowerCase().includes(key)
      })
    return (category && category.value) || null
  }

  @Watch('group', { immediate: true })
  onGroupChanged() {
    if (this.group) {
      this.$set(this, 'form', TransactionDefault())
      const me = (this.members[0] || {}).id // TODO: get my id
      this.form.creator = me
      this.form.currency = this.group.currencies[0]
      this.form.creditors.push({ weight: 1, uid: me })
      this.form.debtors = this.members.map((m): Weight => ({ weight: 1, uid: m.id }))
    }
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

  close(result?) {
    this.$emit('close', result)
  }
}
</script>

<style lang='stylus' scoped>
.bottom-nav
  position absolute
  bottom 0
  left 0
  right 0
</style>
