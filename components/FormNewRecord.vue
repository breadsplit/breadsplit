<template lang='pug'>
v-container
  v-layout
    v-flex(xs12)
      app-category-icon(:category='form.category || categorySense')
      v-text-field(v-model='form.desc' label='Description', required='')
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
