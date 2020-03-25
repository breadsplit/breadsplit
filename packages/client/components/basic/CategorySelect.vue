<template lang='pug'>
.category-select.pa-2(v-columns='`repeat(${columns}, 1fr)`')
  app-category-item(
    v-for='cat in categories'
    @click='setValue(cat.id)'
    :key='cat.id'
    :category='cat'
    :active='value === cat.id'
    clickable
  )
  app-category-item(
    v-if='allowCreate'
    @click='$emit("create")'
    :category='{ text: $t("ui.category_editing.create_short"), icon: "plus" }'
    clickable
  )
</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { GroupMixin } from '~/mixins'

@Component
export default class CategorySelect extends mixins(GroupMixin) {
  @Prop(String) readonly value!: string
  @Prop({ default: 5 }) readonly columns!: number
  @Prop(Boolean) readonly allowCreate?: boolean

  setValue(value) {
    this.$emit('input', value)
  }
}
</script>
