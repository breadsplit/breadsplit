<template lang='pug'>
v-list.transactions-list.pa-0(two-line flat)
  template(v-for='(transaction, index) in transactions')
    v-divider(v-if='index!=0')
    app-transaction-item(
      :key='transaction.id'
      :transaction='transaction'
      :involved='involved'
      :involveMode='involveMode'
    )

  slot(name='append')
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Transaction } from '~/types'

@Component
export default class TransactionsList extends Vue {
  @Prop(Array) readonly transactions!: Transaction[]
  @Prop(String) readonly involved?: string
  @Prop(String) readonly involveMode?: string
}
</script>
