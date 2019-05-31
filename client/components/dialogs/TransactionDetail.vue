<template lang='pug'>
v-card
  app-dialog-bar(@close='close()') Transaction Detail

  pre.pa-4 {{transaction}}
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { DialogChildMixin, GroupMixin } from '~/mixins'

@Component
export default class Members extends mixins(GroupMixin, DialogChildMixin) {
  get transaction() {
    return this.group.transactions.find(t => t.id === this.options.transid)
  }
}
</script>
