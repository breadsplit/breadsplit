<template lang='pug'>
.category-select.pa-2
  template(v-for='cat in categories')
    .item.py-3.pa-2(@click='setValue(cat.name)'
      :class='{ active: value === cat.name, notactive: value !== cat.name }'
      :style='{ "--color": cat.color }'
    )
      v-icon mdi-{{cat.icon}}
      .label {{$t(`cats.${cat.name}.display`)}}
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import DefaultCategories, { Category } from '~/../meta/categories'

@Component
export default class MemberSelect extends Vue {
  @Prop(String) readonly value!: string
  @Prop({ default: () => DefaultCategories }) readonly categories!: Category[]

  setValue (value) {
    this.$emit('input', value)
  }
}
</script>

<style lang='sass'>
.category-select
  display: grid
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr

  .item
    cursor: pointer
    text-align: center
    position: relative
    border-radius: 5px
    --color: grey

    .v-icon
      font-size: 1.9em
      color: var(--color)
      transition: color 0.2s ease-in-out

    .label
      font-size: 0.8em
      margin-top: 1px
      color: var(--color)
      transition: color 0.2s ease-in-out
      line-height: 1em

    &:after
      content: ''
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      background: var(--color)
      opacity: 0
      border-radius: 5px
      transition: opacity 0.2s ease-in-out

    &.active:after
      opacity: 0.15

    &.notactive
      --color: rgba(125, 125, 125, 0.4) !important
</style>
