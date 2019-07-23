<template lang='pug'>
v-icon(:size='size' :style='colorStyle') mdi-{{cat.icon}}
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { ParserCategory } from '~/core'
import { Group } from '~/types'

@Component
export default class CategoryIcon extends Vue {
  @Prop({ default: '' }) readonly category!: string
  @Prop() readonly size?: string
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
