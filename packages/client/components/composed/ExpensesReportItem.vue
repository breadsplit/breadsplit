<template lang='pug'>
v-list-item.expenses-report-item(@click='$emit("selected", item.id)')
  .rank {{index+1}}

  v-list-item-avatar.pr-4
    app-category-icon.mx-2.my-1(
      :category='item.id'
      :text='false'
      :size='38'
      :group='group'
    )

  v-list-item-content
    v-list-item-title {{item.name}}
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

  get percent () {
    return (+this.item.value.div(this.total).mul(100)).toFixed(2)
  }
}
</script>

<style lang='sass'>
.expenses-report-item
  .rank
    padding: 0 1.5em 0 0
    opacity: 0.5
</style>
