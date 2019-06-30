<template lang='pug'>
v-icon(:size='size', :color='color') mdi-{{icon}}
</template>

<script lang='ts'>
import Categories from '~/../meta/categories'
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class CategoryIcon extends Vue {
  @Prop({ default: '' }) readonly category!: string
  @Prop() readonly size?: string
  @Prop({ default: 'other' }) readonly fallback!: string

  get icon() {
    const cat = this.category || this.fallback
    return (Categories.find(c => c.name === cat) || { icon: '' }).icon
  }
  get color() {
    const cat = this.category || this.fallback
    return (Categories.find(c => c.name === cat) || { color: '' }).color
  }
  get colorStyle() {
    return {
      color: this.color,
    }
  }
}
</script>
