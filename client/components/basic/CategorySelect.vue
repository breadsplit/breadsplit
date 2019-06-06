<template lang='pug'>
.category-select
  v-menu(v-model='menu' :max-width='400')
    template(v-slot:activator='{ on }')
      slot(:on='on')

    v-card.pa-2.category-options
      template(v-for='cat in categoryItems')
        app-action-with-text.option.pa-2(v-ripple @click.native='setValue(cat.name)')
          app-category-icon(
            slot='action'
            :category='cat.name',
            size='32'
          )
          app-category-label(
            slot='text'
            :category='cat.name'
          )
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'
// eslint-disable-next-line import/no-named-default
import { Category, default as categories } from '~/../meta/categories'

@Component({
  name: 'AppCategorySelect',
})
export default class CategorySelect extends Vue {
  menu = false

  @Prop(String) readonly value!: string
  @Prop(Array) readonly categories!: Category[]

  get categoryItems() {
    return this.categories || categories
  }

  setValue(value) {
    this.$emit('input', value)
  }
}
</script>

<style lang='stylus'>
.category-options
  display grid
  grid-template-columns 1fr 1fr 1fr 1fr 1fr 1fr

  & > .option
    cursor pointer
</style>
