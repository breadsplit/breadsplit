<template lang='pug'>
.category-select
  v-menu(v-model='menu' :max-width='400')
    template(v-slot:activator='{ on }')
      .vertical-aligned(v-on='on', v-ripple)
        app-category-icon.ma-1(:category='current.name', :inline='true', label)
        v-icon mdi-menu-down

    v-card.pa-2.category-options
      template(v-for='cat in categories')
        app-category-icon.option.pa-2(:category='cat.name', label, v-ripple, @click.native='setValue(cat.name)')
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Category } from '~/meta/categories'

@Component
export default class MemberSelect extends Vue {
  menu = false

  @Prop(String) readonly value!: string
  @Prop(Array) readonly categories!: Category[]

  get current() {
    const cat = this.categories.find(m => m.name === this.value)
    return cat || {}
  }

  setValue(value) {
    this.$emit('input', value)
  }
}
</script>

<style lang='stylus'>
.category-select
  display inline-block

.category-options
  display grid
  grid-template-columns 1fr 1fr 1fr 1fr 1fr 1fr

  & > .option
    cursor pointer
</style>
