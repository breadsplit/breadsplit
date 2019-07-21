<template lang='pug'>
chart-summary-pie(:value='value', style='max-width:350px;')
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import groupBy from 'lodash/groupBy'
import entries from 'lodash/entries'
import DefaultCategories from '../../../meta/categories'
import ChartSummaryPie from './ChartSummaryPie.vue'
import { Transaction } from '~/types'

@Component({
  components: {
    ChartSummaryPie,
  },
})
export default class ChartExpenseSummary extends Vue {
  @Prop() readonly expenses!: Transaction[]

  get value () {
    return entries(groupBy(this.expenses, i => i.category || 'other'))
      .map(([name, values]) => {
        const category = DefaultCategories.find(i => i.name === name) || { color: undefined }
        return {
          name: this.$t(`cats.${name}.display`),
          color: category.color,
          // TODO: apply filter
          value: values.map(v => v.total_fee).reduce((a, b) => a + b, 0),
        }
      })
  }
}
</script>
