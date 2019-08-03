<template lang='pug'>
.balances
  app-balance-item(
    v-for='(balance, index) in limitedBalances'
    :key='balance.uid'
    :balance='balance'
    :max='max'
    :min='min'
  )
</template>

<script lang='ts'>
import { Component, Vue, Getter, Prop } from 'nuxt-property-decorator'
import { Balance } from '~/types'

@Component
export default class Balances extends Vue {
  @Prop({ default: 6 }) readonly limit!: number

  @Getter('group/currentBalances') readonly balances!: Balance[]

  get limitedBalances () {
    return this.balances
      .filter(i => Math.abs(+i.balance) > 0.0001)
      .slice(0, this.limit)
  }

  get max () {
    return Math.max(...this.limitedBalances.map(i => +i.balance))
  }

  get min () {
    return Math.min(...this.limitedBalances.map(i => +i.balance))
  }
}
</script>
