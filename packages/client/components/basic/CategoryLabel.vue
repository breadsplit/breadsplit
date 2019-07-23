<template lang='pug'>
span(:style='colorStyle') {{cat.display}}
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { ParserCategory } from '~/core'
import { Category, Group } from '~/types'

@Component
export default class CategoryIcon extends Vue {
  @Prop({ default: '' }) readonly category!: string | Category
  @Prop({ default: 'other' }) readonly fallback!: string
  @Prop() readonly group!: Group

  get cat () {
    return ParserCategory(this.category, this.group, this)
  }

  get colorStyle () {
    return {
      color: this.cat.color,
    }
  }
}
</script>
