<template lang='pug'>
app-action-with-text.category-icon
  v-icon(slot='action', :size='size', :color='color') mdi-{{icon}}
  span(slot='text' :style='colorStyle', v-if='label') {{display}}
</template>

<script lang='ts'>
import Categories from '~/meta/categories'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class CategoryIcon extends Vue {
  @Prop({ default: '' }) readonly category!: string
  @Prop(Boolean) readonly label!: boolean
  @Prop({ default: 32 }) readonly size!: number
  @Prop({ default: 'other' }) readonly fallback!: string

  get icon() {
    const cat = this.category || this.fallback
    return (Categories.find(c => c.name === cat) || { icon: '' }).icon
  }
  get display() {
    const cat = this.category || this.fallback
    return this.$t(`cats.${cat}.display`)
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
