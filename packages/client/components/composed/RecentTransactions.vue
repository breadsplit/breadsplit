<template lang='pug'>
.recent-transactions
  .text-center(v-if='chart')
    chart-expense-summary(:trans='filteredTransactions' :group='group')

  v-card
    v-subheader
      v-icon.mr-1 mdi-script-text-outline
      span {{$t('ui.tabs.transactions')}}

    app-transactions-list(:transactions='limitted')
      template(v-slot:append v-if='needShowMore')
        v-divider
        .text-center.pa-2
          v-btn(text small fluid color='primary' @click='$emit("show-all")') {{$t('ui.show-all')}}
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import ChartExpenseSummary from '../charts/ChartExpenseSummary.vue'
import { GroupMixin, NavigationMixin } from '~/mixins'

@Component({
  components: {
    ChartExpenseSummary,
  },
})
export default class RecentTransactions extends mixins(GroupMixin, NavigationMixin) {
  collapsed = true

  @Prop({ default: 3 }) readonly limit!: number
  @Prop(Boolean) readonly flat?: boolean
  @Prop(Boolean) readonly chart?: boolean

  get transactions () {
    return this.group.transactions
      .map(i => i)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  get amount () {
    return this.transactions.length
  }

  get limitted () {
    if (this.collapsed)
      return this.transactions.slice(0, this.limit)
    return this.transactions
  }

  get needShowMore () {
    return this.collapsed && this.amount > this.limit
  }
}
</script>
