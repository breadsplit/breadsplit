<template lang='pug'>
chart-summary-pie(:value='value' :style='{ width }')
</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import groupBy from 'lodash/groupBy'
import entries from 'lodash/entries'
import ChartSummaryPie from './ChartSummaryPie.vue'
import { ParserCategory } from '~/core'
import { Transaction, Group } from '~/types'
import { CommonMixin } from '~/mixins'

@Component({
  components: {
    ChartSummaryPie,
  },
})
export default class ChartExpenseSummary extends mixins(CommonMixin) {
  @Prop() readonly trans!: Transaction[]
  @Prop() readonly group!: Group

  get width () {
    if (this.isMobile)
      return 300
    else
      return 350
  }

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
