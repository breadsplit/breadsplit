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
          app-member-select(:members='members', v-model='form.creditor')
          span paid
          v-spacer

      //v-flex(xs12)
        v-text-field(v-model='form.desc' label='Description', required='')
          template(slot='prepend')
            app-category-icon(:category='form.category || categorySense')
</template>

<script lang='ts'>
import Categories, { CategoryKeys } from '@/meta/categories'
import GroupMixin from '../mixins/group'
import { Component, Mixins } from 'vue-property-decorator'

@Component
export default class extends Mixins(GroupMixin) {
  form = {
    desc: '',
    category: '',
    creditor: '',
  }
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

  mounted() {
    this.form.creditor = (this.members[0] || {}).id
  }

  close(result) {
    this.$emit('close', result)
  }
}
</script>
