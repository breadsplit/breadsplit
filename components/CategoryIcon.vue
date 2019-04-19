<template lang='pug'>
app-action-with-text.category-icon
  v-icon(slot='action', size='32', :color='color') mdi-{{icon}}
  span(slot='text' :style='colorStyle') {{display}}
</template>

<script>
import Categories from '@/meta/categories'

export default {
  props: {
    category: { type: String, default: '' },
  },
  computed: {
    icon() {
      const cat = this.category || 'other'
      return (Categories.find(c => c.name === cat) || {}).icon
    },
    display() {
      const cat = this.category || 'other'
      return this.$t(`cats.${cat}.display`)
    },
    color() {
      const cat = this.category || 'other'
      return (Categories.find(c => c.name === cat) || {}).color
    },
    colorStyle() {
      return {
        color: this.color,
      }
    },
  },
}
</script>
