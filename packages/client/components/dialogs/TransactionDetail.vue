<template lang='pug'>
v-card
  app-dialog-bar(@close='close()') Transaction Detail

  v-btn(color='primary', @click='removeTransaction') Delete
  pre.pa-4 {{transaction}}
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { DialogChildMixin, GroupMixin } from '~/mixins'

@Component
export default class Members extends mixins(GroupMixin, DialogChildMixin) {
  get transid (): string {
    return this.options.transid || ''
  }

  get transaction () {
    return this.group.transactions.find(t => t.id === this.transid)
  }

  removeTransaction () {
    this.$store.dispatch('group/removeTransaction', { transid: this.transid })
    this.close()
  }
}
</script>
