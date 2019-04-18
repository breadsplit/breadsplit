<template lang='pug'>
v-card
  v-toolbar(dark, color='primary')
    v-btn(icon, dark, @click='close(false)')
      v-icon mdi-close
    v-toolbar-title New Expense

  v-container
    v-layout
      v-flex(xs12)
        v-text-field(v-model='form.desc' label='Description', required='')
          template(slot='prepend')
            app-category-icon(:category='form.category || categorySense')
</template>

<script>
import Categories, { CategoryKeys } from '@/meta/categories'

export default {
  data() {
    return {
      form: {
        desc: '',
        category: '',
      },
      cats: Categories,
    }
  },
  computed: {
    categoriesKeywords() {
      const keys = []
      CategoryKeys.map((c) => {
        const { keywords } = this.$t(`cats.${c}`)
        for (const key of (keywords || '').split(',').map(i => i.trim()).filter(i => i))
          keys.push({ key, value: c })
        return keywords
      })
      return keys
    },
    categorySense() {
      const category = this.categoriesKeywords
        .find(({ key, value }) => {
          return (this.form.desc || '').toLowerCase().includes(key)
        })
      return (category || {}).value
    },
  },
}
</script>
