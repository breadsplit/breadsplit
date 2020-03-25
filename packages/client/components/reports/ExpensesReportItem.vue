<template lang='pug'>
v-list-item.expenses-report-item(
  @click='$emit("selected", item.id)'
  :ripple='false'
  :style='{"--color": item.color, "--percent": `${percent}%`}'
)
  .rank {{index+1}}

  v-list-item-avatar.px-2(style='width:inherit')
    v-icon(
      :color='item.color'
      :size='38'
    ) mdi-{{item.icon}}

  v-list-item-content
    v-list-item-title {{item.label}}
    v-list-item-subtitle.sub-label {{percent}}%

  v-list-item-action.pr-1.text-right
    app-money-label(
      :amount='-item.value'
      :currency='item.currency'
      color
    )
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { GroupMixin } from '~/mixins'
import { ExpensesByCategoriesItem } from '~/core'

@Component
export default class ExpensesReportItem extends mixins(GroupMixin) {
  @Prop(Object) readonly item!: ExpensesByCategoriesItem
  @Prop(Number) readonly index!: number
  @Prop(Number) readonly total!: number

  get percent() {
    return +(+this.item.value.div(this.total).mul(100)).toFixed(2)
  }
}
</script>

<style lang='sass'>
.expenses-report-item
  --color: #000
  --precent: 0%
  .rank
    opacity: 0.5

  &:after
    content: ''
    position: absolute
    left: 0
    bottom: 0
    height: 3px
    width: var(--percent)
    background: var(--color)
    opacity: 0.6
    border-top-right-radius: 5px
</style>
