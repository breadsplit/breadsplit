<template lang='pug'>
v-card.new-trans-form
  v-toolbar(flat, color='transparent')
    v-btn(icon, @click='close(false)')
      v-icon(color='primary') mdi-close
    v-toolbar-title.primary--text New Expense

  v-window(v-model='step')
    v-window-item(:value='1')
      v-container
        v-layout(column)
          v-flex.ma-2
            .vertical-aligned
              template(v-if='form.creditors.length === 1')
                app-member-select(:members='members', v-model='form.creditors[0].memberId')
              span.mr-2 paid

          v-flex.ma-2
            p TODO: soft keybard

          v-flex.ma-2
            v-text-field(
              v-model.number='form.total_fee' type='number' reverse outline
              label='Total' required hide-details :prefix='form.currency')

    v-window-item(:value='2')
      v-container
        v-layout(column)

          v-flex.ma-2
            v-text-field(
              v-model='form.desc' label='Description' placeholder='Some expense...'
              hide-details required box)
              template(slot='append')
                app-category-icon(:category='form.category || categorySense')

          v-flex.ma-2
            v-alert(:value='true', type='warning') Work in progress...

          v-flex.px-2.mb-3
            v-list(subheader).pb-1
              template(v-for='(i,idx) in balanceChanges')
                v-divider(v-if='idx!==0')
                v-list-tile(avatar)
                  v-list-tile-action.mt-1
                    app-user-avatar(:id='i.memberId', inline, size='40')
                  v-list-tile-content
                    v-list-tile-title.text-xs-right.pr-3
                      app-money-label(:amount='i.balance', :currency='form.currency')
                  v-list-tile-action
                    v-text-field(
                      type='number' style='width:50px'
                      solo hide-details reverse
                      v-model.number='form.debtors.find(d=>d.memberId===i.memberId).weight')

  .bottom-nav
    v-divider
    v-card-actions.pa-3
      v-btn(v-show='step !== 1', flat, @click='step--')
        | Back
      v-spacer

      template(v-if='step === 1')
        v-btn(:disabled='!form.total_fee', color='primary', flat, @click='submit')
          | Quick add
        v-btn(:disabled='!form.total_fee', color='primary', depressed, @click='step++')
          | Next

      template(v-if='step === 2')
        v-btn(:disabled='step === 3', color='primary', depressed, @click='submit')
          | Save
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator'
import Categories, { CategoryKeys } from '~/meta/categories'
import GroupMixin from '~/mixins/group'
import { Transaction, Weight } from '~/types/models'
import { TransactionDefault } from '~/utils/defaults'
import { TransactionBalanceChanges } from '~/utils/core'

@Component
export default class FormNewTransaction extends Mixins(GroupMixin) {
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

  get categorySense() {
    const category = this.categoriesKeywords
      .find(({ key, value }) => {
        return (this.form.desc || '').toLowerCase().includes(key)
      })
    return (category && category.value) || null
  }

  get balanceChanges() {
    return TransactionBalanceChanges(this.form)
  }

  @Watch('group', { immediate: true })
  onGroupChanged() {
    if (this.group) {
      this.$set(this, 'form', TransactionDefault())
      const me = (this.members[0] || {}).id // TODO: get my id
      this.form.creator = me
      this.form.currency = this.group.currencies[0]
      this.form.creditors.push({ weight: 1, memberId: me })
      this.form.debtors = this.members.map((m): Weight => ({ weight: 1, memberId: m.id }))
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

  close(result?) {
    this.$emit('close', result)
  }
}
</script>

<style lang='stylus' scoped>
.new-trans-form
  padding-bottom 60px

.bottom-nav
  position absolute
  bottom 0
  left 0
  right 0
</style>
