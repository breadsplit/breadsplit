<template lang='pug'>
chart-summary-pie(:value='value' :style='{ width }')
</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import Fraction from 'fraction.js'
import { ExchangeInTransaction } from '../../../core/balance'
import ChartSummaryPie from './ChartSummaryPie.vue'
import { ParserCategory, TransactionBalanceChanges } from '~/core'
import { Transaction, Group } from '~/types'
import { CommonMixin } from '~/mixins'

@Component({
  components: {
    ChartSummaryPie,
  },
})
export default class ChartExpenseSummary extends mixins(CommonMixin) {
  @Prop() readonly transactions!: Transaction[]
  @Prop() readonly group!: Group
  @Prop(String) readonly involved?: string
  @Prop({ type: Array, default: () => ['transfer'] }) readonly ignoredCategories!: string[]

  get width () {
    if (this.isMobile)
      return 300
    else
      return 350
  }

  get value () {
    const records: Record<string, {id: string; name: string; color: string; value: Fraction}> = {}
    for (const transaction of this.transactions) {
      const categoryid = transaction.category || 'other'

      if (this.ignoredCategories.includes(categoryid))
        continue

      if (!records[categoryid]) {
        const category = ParserCategory(categoryid, this.group, this)
        records[categoryid] = {
          id: categoryid,
          name: category.text,
          color: category.color,
          value: new Fraction(0),
        }
      }

      let value = new Fraction(transaction.total_fee)
      if (this.involved) {
        const balance = TransactionBalanceChanges(transaction).find(i => i.uid === this.involved)
        if (!balance)
          value = new Fraction(0)
        else
          value = balance.debt
      }

      const exchanged = ExchangeInTransaction(transaction, value, this.group.main_currency)
      records[categoryid].value = records[categoryid].value.add(exchanged)
    }

    return Object.values(records).map(r => ({ ...r, value: +r.value }))
  }
}
</script>
