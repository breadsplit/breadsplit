<template lang='pug'>
.recent-transactions
  v-card
    v-subheader
      v-icon.mr-1 mdi-script-text-outline
      span {{$t('ui.tabs.transactions')}}

    app-transactions-list(:transactions='limitted')
      template(v-slot:append v-if='needShowMore')
        v-divider
        .text-center.pa-2
          v-btn(text small fluid color='primary' @click='$emit("show-all")') {{$t('ui.show_all')}}
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { GroupMixin, NavigationMixin } from '~/mixins'

@Component
export default class RecentTransactions extends mixins(GroupMixin, NavigationMixin) {
  collapsed = true

  @Prop({ default: 3 }) readonly limit!: number

  get transactions () {
    return this.group.transactions
      .map(i => i)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  get amount () {
    return this.transactions.length
  }

  get limitted () {
    if (this.collapsed)
      return this.transactions.slice(0, this.limit)
    return this.transactions
  }

  get needShowMore () {
    return this.collapsed && this.amount > this.limit
  }
}
</script>
