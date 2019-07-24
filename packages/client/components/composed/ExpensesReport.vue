<template lang='pug'>
.expenses-report
  .text-center
    app-date-range-select(:from.sync='from' :to.sync='to' :unit.sync='unit')
    chart-summary-pie(
      v-if='filteredTransactions.length'
      :value='expenseSummary'
      :style='{ width: chartWidth }'
    )

  v-checkbox(v-model='onlyMe' :label='$t("ui.transactions.involved")')

  v-card.mt-2
    template(v-if='!filteredTransactions.length')
      .pa-4
        v-subheader {{$t('ui.no_expenses_in_range')}}
    template(v-else)
      v-tabs(v-model='tab')
        v-tab {{$t('ui.report.mode_category')}}
        v-tab {{$t('ui.report.mode_expenses')}}
      v-tabs-items(v-model='tab')
        v-tab-item
          v-list.pa-0(two-line)
            template(v-for='(item, index) in expenseSummary')
              v-divider(v-if='index!=0')
              app-expenses-report-item(:item='item' :total='totalAmount' :index='index' @selected='i=>categoryFilter=i')
        v-tab-item
          app-transactions-list(:transactions='filteredTransactions' :involved='involved' involveMode='expense')
</template>

<script lang='ts'>
import { Component, mixins, Getter } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import Fraction from 'fraction.js'
import { DateRangeUnit } from '../basic/DateRangeSelect.vue'
import ChartSummaryPie from '../charts/ChartSummaryPie.vue'
import { IdMe, ReportExpensesByCategories } from '~/core'
import { GroupMixin, CommonMixin } from '~/mixins'

@Component({
  components: {
    ChartSummaryPie,
  },
})
export default class ExpensesReport extends mixins(GroupMixin, CommonMixin) {
  mode: 'category' | 'expense' = 'category'
  onlyMe = true
  ignoredCategories = ['transfer']
  internalCategoryFilter: string | null = null

  tab = 0

  from = +new Date()
  to = +new Date()
  unit: DateRangeUnit = 'month'

  @Getter('user/uid') uid: string | undefined

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

  get chartWidth () {
    if (this.isMobile)
      return 300
    else
      return 350
  }

  get totalAmount () {
    return +this.expenseSummary.map(e => e.value).reduce((a, b) => a.add(b), new Fraction(0))
  }

  get expenseSummary () {
    return ReportExpensesByCategories(this, this.filteredTransactions, this.group, this.ignoredCategories, this.involved)
  }

  get categoryFilter () {
    return this.internalCategoryFilter
  }

  set categoryFilter (value) {
    // this.internalCategoryFilter = value
    // if (value && this.mode === 'category')
    //  this.mode = 'expense'
    // TODO:wip category filter
  }
}
</script>
