<template lang='pug'>
div
  app-grid(columns='max-content auto')
    slot(name='header')

    v-tabs(v-model='tab', v-if='showTabs', slider-color='transparent' grow)
      v-tab(:class='tab == 0 ? "primary--text" : ""')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-account-multiple
        v-expand-x-transition
          span(v-show='tab === 0') {{$t('ui.splitting.average')}}

      v-tab(:class='tab == 1 ? "primary--text" : ""')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-currency-usd
        v-expand-x-transition
          span(v-show='tab === 1') {{$t('ui.splitting.amount')}}

      v-tab(:class='tab == 2 ? "primary--text" : ""')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-percent
        v-expand-x-transition
          span(v-show='tab === 2') {{$t('ui.splitting.percent')}}

      v-tab(:class='tab == 3 ? "primary--text" : ""')
        v-icon(style='color:inherit;transition:none;').mr-1 mdi-scale-balance
        v-expand-x-transition
          span(v-show='tab === 3') {{$t('ui.splitting.weight')}}

  v-tabs-items(v-model='tab')
    v-tab-item(v-for='i in 4', :key='i')
      v-list(subheader).pb-1
        template(v-for='(i,idx) in balanceChanges', v-if='getRecord(i.uid)')
          v-divider
          v-list-tile
            v-list-tile-action(style='min-width: 40px')
              app-user-avatar(:id='i.uid', size='30')
            v-list-tile-content
              v-list-tile-title
                app-user-info(:id='i.uid', field='name')
            v-list-tile-content
              v-list-tile-title.text-xs-right.pr-3
                app-money-label(:amount='getAmount(i.uid)', :currency='trans.currency')
            template(v-if='tab === 0')
              v-list-tile-action(v-if='showTabs' style='width:32px;min-width:inherit')
                v-checkbox(
                  :input-value='getWeight(i.uid)'
                  @change='v=>setWeight(i.uid, v?1:0)')
            template(v-else-if='tab === 3')
              v-list-tile-action
                v-text-field(
                  type='number' style='width:50px'
                  flat hide-details reverse
                  :min='0'
                  v-model.number='getRecord(i.uid).weight')

</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TransactionBalanceChanges } from '~/core'
import { Transaction } from '~/types'

type Splitmode = 'average' | 'amount' | 'percent' | 'weight'

@Component
export default class Splitting extends Vue {
  tab = 0

  @Prop(Object) readonly trans!: Transaction
  @Prop({ default: 'debtors' }) readonly on!: 'debtors' | 'creditors'
  @Prop({ default: true }) readonly showTabs!: boolean

  get splitmode(): Splitmode {
    switch (this.tab) {
      case 0:
        return 'average'
      case 1:
        return 'amount'
      case 2:
        return 'percent'
      default:
        return 'weight'
    }
  }

  get balanceChanges() {
    return TransactionBalanceChanges(this.trans)
  }

  getRecord(uid: string) {
    return this.trans[this.on]
      .find(d => d.uid === uid)
  }

  getBalance(uid) {
    return this.balanceChanges
      .find(d => d.uid === uid)
  }

  getAmount(uid: string) {
    const balance = this.getBalance(uid)
    if (!balance)
      return 0
    if (this.on === 'debtors')
      return -balance.debt
    if (this.on === 'creditors')
      return balance.credit
  }

  getWeight(uid: string) {
    const record = this.getRecord(uid)
    return (record && record.weight) || 0
  }

  setWeight(uid: string, weight: number) {
    const record = this.getRecord(uid)
    if (record)
      record.weight = weight
  }
}
</script>

<style lang='stylus'>
.v-tabs__item
  white-space nowrap
</style>
