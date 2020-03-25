<template lang='pug'>
.balances-chart.pa-4
  .chart(v-if='limitedBalances.length')
    app-balance-item(
      v-for='(balance, index) in limitedBalances'
      :key='balance.uid'
      :balance='balance'
      :max='max'
      :min='min'
    )
  template(v-else)
    app-empty-placeholder(
      icon='check-all'
      :title='$t("placeholders.balances.title")'
      dense
    )
</template>

<script lang='ts'>
import { Component, Vue, Getter, Prop } from 'nuxt-property-decorator'
import { Balance } from '~/types'

@Component
export default class Balances extends Vue {
  @Prop({ default: 6 }) readonly limit!: number

  @Getter('group/currentBalances') readonly balances!: Balance[]

  get limitedBalances() {
    return this.balances
      .filter(i => Math.abs(+i.balance) > 0.0001)
      // .slice(0, this.limit)
  }

  get max() {
    return Math.max(...this.limitedBalances.map(i => +i.balance))
  }

  get min() {
    return Math.min(...this.limitedBalances.map(i => +i.balance))
  }
}
</script>

<style lang="sass">
.balances-chart
  & > .chart
    max-width: 700px
    margin: 0 auto
</style>
