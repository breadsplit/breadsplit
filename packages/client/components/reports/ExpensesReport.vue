<template lang='pug'>
.expenses-report
  .text-center
    app-date-range-select(:from.sync='from' :to.sync='to' :unit.sync='unit')
    .pb-3
    v-expand-transition
      div(v-show='filteredTransactions.length && !categoryFilter')
        chart-summary-pie(
          :value='expenseSummary'
          :style='{ width: chartWidth }'
          @click:id='i=>categoryFilter=i'
        )

  v-card.mt-2.pa-2
    .filter
      .header {{$t('ui.show_expenses_of')}}
      v-chip-group.chips(v-model='involvedIndex' column mandatory active-class='primary--text')
        v-chip.pr-5
          v-icon.ml-1(left) mdi-account-group
          | {{$t('noun.group')}}
        v-chip {{$t('pronoun.me')}}
        v-chip(disabled) {{$t('noun.others')}}

    .filter(v-if='categoryFilter')
      .header {{$t('noun.category')}}
      v-chip.chips.colorful(close
        :style='{"--color": categoryFilterInfo.color}'
        @click:close='categoryFilter = null'
      )
        v-icon.ml-1(left :color='categoryFilterInfo.color') mdi-{{categoryFilterInfo.icon}}
        | {{categoryFilterInfo.text}}

  v-card.mt-2
    template(v-if='!filteredTransactions.length')
      .pa-4
        v-subheader {{$t('ui.no_expenses_in_range')}}
    template(v-else)
      v-list-item
        v-icon(color='primary').mr-2 mdi-equal-box
        .primary--text {{$t('ui.total')}}
        v-spacer
        app-money-label(
          :amount='-filteredTotalAmount'
          :currency='displayCurrency'
          color
        )
      v-divider
      v-tabs(v-model='tab' v-if='!categoryFilter')
        v-tab {{$t('ui.report.mode_category')}}
        v-tab {{$t('ui.report.mode_expenses')}} ({{filteredTransactions.length}})
      v-divider
      v-tabs-items(v-model='tab' :touchless='categoryFilter')
        v-tab-item
          v-list.pa-0(two-line)
            template(v-for='(item, index) in expenseSummary')
              v-divider(v-if='index!=0')
              app-expenses-report-item(:item='item' :total='totalAmount' :index='index' @selected='i=>categoryFilter=i')
        v-tab-item
          app-transactions-list(:transactions='filteredTransactions' :involved='involved' involveMode='expense')

  template(v-if='categoryFilter')
    .text-center.py-2
      v-btn(text @click='categoryFilter = null' color='grey') {{$t('ui.clear_filter')}}

  .mb-8
</template>

<script lang='ts'>
import { Component, mixins, Getter } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import Fraction from 'fraction.js'
import { oc } from 'ts-optchain'
import { DateRangeUnit } from '../basic/DateRangeSelect.vue'
import ChartSummaryPie from '../charts/ChartSummaryPie.vue'
import { ReportExpensesByCategories, IdMe } from '~/core'
import { GroupMixin, CommonMixin } from '~/mixins'

@Component({
  components: {
    ChartSummaryPie,
  },
})
export default class ExpensesReport extends mixins(GroupMixin, CommonMixin) {
  private internalCategoryFilter: string | null = null
  private involvedIndex = 0

  ignoredCategories = ['transfer']

  tab = 0

  from = +new Date()
  to = +new Date()
  unit: DateRangeUnit = 'month'

  @Getter('user/uid') uid: string | undefined
  @Getter('group/currentDisplayCurrency') readonly displayCurrency!: string

  get transactions () {
    return this.group.transactions
      .map(i => i)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  get amount () {
    return this.transactions.length
  }

  get involved () {
    if (this.involvedIndex === 1) {
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
    let filtered = this.transactions
      .filter(t => t.timestamp >= from && t.timestamp < to)

    if (this.categoryFilter)
      filtered = filtered.filter(t => (t.category || 'other') === this.categoryFilter)
    else
      filtered = filtered.filter(t => !this.ignoredCategories.includes(t.category || 'other'))

    return filtered
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

  get filteredTotalAmount () {
    if (this.categoryFilter)
      return +oc(this.expenseSummary.find(e => e.id === this.categoryFilter)).value(new Fraction(0))
    return this.totalAmount
  }

  get expenseSummary () {
    return ReportExpensesByCategories(
      this,
      this.filteredTransactions,
      this.group,
      this.ignoredCategories,
      this.involved,
      this.displayCurrency
    )
  }

  get categoryFilter () {
    return this.internalCategoryFilter
  }

  set categoryFilter (value) {
    this.internalCategoryFilter = value
    if (value)
      this.tab = 1
    else
      this.tab = 0
  }

  get categoryFilterInfo () {
    if (!this.categoryFilter)
      return
    return this.parseCategory(this.categoryFilter)
  }
}
</script>

<style lang="sass">
.expenses-report
  .filter
    .header
      margin: 5px 15px
      opacity: 0.6
      display: inline-block
      vertical-align: middle
    .chips
      display: inline-block
      vertical-align: middle
</style>