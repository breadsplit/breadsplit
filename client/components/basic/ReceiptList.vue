<template lang='pug'>
.receipt-list(v-columns='"auto max-content"')
  template(v-for='(item, index) of items')
    template(v-if='!item')
      v-divider
      v-divider
    template(v-else)
      slot(name='item' :item='item' :index='index')
        div {{item.desc}}
      .text-xs-right(style='margin: auto 0')
        app-money-label(:amount='item.amount' :currency='item.currency || currency' color)
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class ReceiptList extends Vue {
  @Prop({ default: () => [] }) readonly items!: {amount: number; currency?: string}[]
  @Prop(String) readonly currency?: string
}
</script>
