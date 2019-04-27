<template lang='pug'>
app-action-with-text.category-icon
  v-icon(slot='action', :size='size', :color='color') mdi-{{icon}}
  span(slot='text' :style='colorStyle', v-if='label') {{display}}
</template>

<script>
import Categories from '@/meta/categories'

export default {
  props: {
    category: { type: String, default: '' },
    label: { type: Boolean, default: false },
    size: { type: Number, default: 32 },
    fallback: { type: String, default: 'other' },
  },
  computed: {
    icon() {
      const cat = this.category || this.fallback
      return (Categories.find(c => c.name === cat) || {}).icon
    },
    display() {
      const cat = this.category || this.fallback
      return this.$t(`cats.${cat}.display`)
    },
    color() {
      const cat = this.category || this.fallback
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
