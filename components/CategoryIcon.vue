<template lang='pug'>
.category-icon
  v-icon(size='32', :color='color') mdi-{{icon}}
  .desc(:style='colorStyle') {{display}}
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

<style lang="stylus" scoped>
.category-icon
  display inline-block
  padding 0 5px
  min-width 60px
  text-align center
  .desc
    display block
    font-size 0.8em

</style>
