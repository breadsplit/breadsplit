<template lang='pug'>
app-promise-dialog(ref='dialog' width='500')
  v-card.pa-2

    v-card-title {{$t('ui.transactions.select_type')}}
    v-card-content.pb-3(v-columns='"1fr 1fr 1fr"')
      .action-with-text.py-3(@click='group()')
        v-icon.action(size='48') mdi-account-group
        .text {{$t('ui.transactions.type_expense')}}

      .action-with-text.py-3(@click='personal()')
        v-icon.action(size='48') mdi-account-cash
        .text {{$t('ui.transactions.type_personal')}}

      .action-with-text.py-3(@click='transfer()')
        v-icon.action(size='48') mdi-account-arrow-right
        .text {{$t('ui.transactions.type_transfer')}}
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import PromiseDialog from '../global/PromiseDialog.vue'
import { NavigationMixin } from '~/mixins'

@Component
export default class NewTransactionSelect extends mixins(NavigationMixin) {
  dialog = false

  $refs!: {
    dialog: PromiseDialog
  }

  async open() {
    this.dialog = true

    return await this.$refs.dialog.open()
  }

  close() {
    this.$refs.dialog.close()
  }

  group() {
    this.close()
    this.gotoNewTransaction()
  }

  transfer() {
    this.close()
    this.gotoNewTransaction({ type: 'transfer' })
  }

  personal() {
    this.close()
    this.gotoNewTransaction({ solo: true })
  }
}
</script>
