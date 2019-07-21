<template lang='pug'>
v-icon(:size='size', :style='colorStyle') mdi-{{icon}}
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Categories from '~/../meta/categories'

@Component
export default class CategoryIcon extends Vue {
  @Prop({ default: '' }) readonly category!: string
  @Prop() readonly size?: string
  @Prop({ default: 'other' }) readonly fallback!: string
  @Prop({ default: true }) readonly active!: boolean

  get icon () {
    const cat = this.category || this.fallback
    return (Categories.find(c => c.name === cat) || { icon: '' }).icon
  }
  get color () {
    const cat = this.category || this.fallback
    return (Categories.find(c => c.name === cat) || { color: '' }).color
  }
  get colorStyle () {
    return {
      color: this.active ? this.color : 'var(--theme-inactive)',
    }
  }
}
</script>
