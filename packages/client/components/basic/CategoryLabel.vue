<template lang='pug'>
span(:style='colorStyle') {{display}}
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Categories from '~/../meta/categories'

@Component
export default class CategoryIcon extends Vue {
  @Prop({ default: '' }) readonly category!: string
  @Prop({ default: 'other' }) readonly fallback!: string

  get display () {
    const cat = this.category || this.fallback
    return this.$t(`cats.${cat}.display`)
  }
  get color () {
    const cat = this.category || this.fallback
    return (Categories.find(c => c.name === cat) || { color: '' }).color
  }
  get colorStyle () {
    return {
      color: this.color,
    }
  }
}
</script>
