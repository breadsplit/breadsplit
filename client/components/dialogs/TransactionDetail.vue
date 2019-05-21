<template lang='pug'>
v-card
  app-dialog-bar(@close='close()') Transaction Detail

  pre.pa-4 {{transaction}}
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import { DialogChildMixin, GroupMixin } from '~/mixins'

@Component
export default class Members extends Mixins(GroupMixin, DialogChildMixin) {
  get transaction() {
    return this.group.transactions.find(t => t.id === this.options.trans_id)
  }
}
</script>
