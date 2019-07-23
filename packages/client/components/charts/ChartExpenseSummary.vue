<template lang='pug'>
chart-summary-pie(:value='value', style='max-width:350px;')
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import groupBy from 'lodash/groupBy'
import entries from 'lodash/entries'
import ChartSummaryPie from './ChartSummaryPie.vue'
import { ParserCategory } from '~/core'
import { Transaction, Group } from '~/types'

@Component({
  components: {
    ChartSummaryPie,
  },
})
export default class ChartExpenseSummary extends Vue {
  @Prop() readonly trans!: Transaction[]
  @Prop() readonly group!: Group

  get value () {
    return entries(groupBy(this.trans, i => i.category || 'other'))
      .map(([id, values]) => {
        const category = ParserCategory(id, this.group, this)
        return {
          name: category.text,
          color: category.color,
          // TODO: apply filter
          value: values.map(v => v.total_fee).reduce((a, b) => a + b, 0),
        }
      })
  }
}
</script>
