<template lang='pug'>
.category-item.pa-2(
  @click='e=>$emit("click", e)'
  :class='{ active: active, notactive: !active, color, clickable }'
  :style='{ "--color": category.color }'
)
  v-icon mdi-{{ category.icon }}
  .label(v-if='!hideLabel') {{ category.text }}
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Category } from '~/types'

@Component
export default class CategoryItem extends Vue {
  @Prop(Object) readonly category!: Category
  @Prop(Boolean) readonly active?: boolean
  @Prop(Boolean) readonly hideLabel?: boolean
  @Prop(Boolean) readonly color?: boolean
  @Prop(Boolean) readonly clickable?: boolean
}
</script>

<style lang="sass">
.category-item
  text-align: center
  position: relative
  border-radius: 5px
  --color: grey

  &.clickable
    cursor: pointer

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

  .theme--light &.notactive:not(.color)
    --color: rgba(180, 180, 180, 0.9) !important

  .theme--dark &.notactive:not(.color)
    --color: rgba(180, 180, 180, 0.5) !important
</style>
