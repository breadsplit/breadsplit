<template lang='pug'>
.category-select.pa-2(v-columns='`repeat(${columns}, 1fr)`')
  app-category-item(
    v-for='cat in categories'
    @click='setValue(cat.id)'
    :key='cat.id'
    :category='cat'
    :active='value === cat.id'
  )
</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { Group } from '~/types'
import { GroupMixin } from '~/mixins'

@Component
export default class CategorySelect extends mixins(GroupMixin) {
  @Prop(String) readonly value!: string
  @Prop() readonly group!: Group
  @Prop({ default: 5 }) readonly columns!: number

  setValue (value) {
    this.$emit('input', value)
  }
}
</script>
