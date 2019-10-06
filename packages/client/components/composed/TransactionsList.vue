<template lang='pug'>
v-list.transactions-list.pa-0(two-line flat)
  recycle-scroller(
    :items='transactions'
    :item-size='75'
    key-field='id'
    v-slot='{ item, index }'
    page-mode
  )
    v-divider(v-if='index!=0')
    app-transaction-item(
      :key='item.id'
      :transaction='item'
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
