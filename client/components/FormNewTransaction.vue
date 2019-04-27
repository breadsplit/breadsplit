<template lang='pug'>
v-card
  v-toolbar(dark, color='primary')
    v-btn(icon, dark, @click='close(false)')
      v-icon mdi-close
    v-toolbar-title New Expense

  v-container
    v-layout(column)

      v-flex
        .vertical-aligned
          template(v-if='form.creditors.length === 1')
            app-member-select(:members='members', v-model='form.creditors[0].memberId')
          span paid
          v-spacer

      v-flex
        v-text-field(v-model='form.desc' label='Description', required='')
          template(slot='prepend')
            app-category-icon(:category='form.category || categorySense')

      v-flex
        v-text-field(v-model.number='form.total_fee' type='number' label='Total' required prepend-icon='mdi-currency-usd')

      v-flex
        v-text-field(v-model.number='form.currency' label='Currency' disabled)

      v-flex
        template(v-for='changes in balanceChanges')
          p {{changes}}

      v-flex
        v-btn(color='primary', @click='submit') Add Expense

</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator'
import Categories, { CategoryKeys } from '~/meta/categories'
import GroupMixin from '~/mixins/group'
import { Transaction, Weight } from '~/types'
import { TransactionDefault } from '~/utils/defaults'
import { TransactionBalanceChanges } from '~/utils/core'

@Component
export default class FormNewTransaction extends Mixins(GroupMixin) {
  form: Transaction = TransactionDefault()
  cats = Categories

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
    this.$store.commit('group/newTranscation', { id: this.group.id, trans })
    this.close()
  }

  close(result?) {
    this.$emit('close', result)
  }
}
</script>
