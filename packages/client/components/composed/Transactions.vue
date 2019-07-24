<template lang='pug'>
.transactions
  .text-center(v-if='chart')
    app-date-range-select(:from.sync='from' :to.sync='to' :unit.sync='unit')
    chart-expense-summary(
      v-if='filteredTransactions.length'
      :transactions='filteredTransactions'
      :involved='involved'
      :group='group'
    )

  v-checkbox(v-model='onlyMe' :label='$t("ui.transactions.involved")')
  v-card.mt-2
    template(v-if='!filteredTransactions.length')
      .pa-4
        v-subheader {{$t('ui.no_expenses_in_range')}}
    template(v-else)
      app-transactions-list(:transactions='filteredTransactions' :involved='involved')
</template>

<script lang='ts'>
import { Component, mixins, Prop, Getter } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import ChartExpenseSummary from '../charts/ChartExpenseSummary.vue'
import { DateRangeUnit } from '../basic/DateRangeSelect.vue'
import { IdMe } from '~/core'
import { Transaction } from '~/types'
import { GroupMixin } from '~/mixins'

@Component({
  components: {
    ChartExpenseSummary,
  },
})
export default class Transactions extends mixins(GroupMixin) {
  collapsed = true
  unit: DateRangeUnit = 'month'
  onlyMe = true

  @Getter('user/uid') uid: string | undefined

  @Prop({ default: 3 }) readonly limit!: number
  @Prop(Boolean) readonly flat?: boolean
  @Prop(Boolean) readonly chart?: boolean

  from = +new Date()
  to = +new Date()

  get transactions () {
    return this.group.transactions
      .map(i => i)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  get amount () {
    return this.transactions.length
  }

  get involved () {
    if (this.onlyMe) {
      if (this.group.online)
        return this.uid
      else
        return IdMe
    }
    return undefined
  }

  get filteredTransactions () {
    const from = +dayjs(this.from)
    const to = +dayjs(this.to)
    return this.transactions
      .filter(t => t.timestamp >= from && t.timestamp < to)
  }

  getTotalAmount (trans: Transaction[]) {
    // TODO: currency exchange
    return trans.map(t => t.total_fee).reduce((a, b) => a + b, 0)
  }
}
</script>
