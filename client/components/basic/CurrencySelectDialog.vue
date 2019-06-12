<template lang='pug'>
app-dialog(ref='dialog' width='350')
  v-card.currency-select-dialog(v-rows='"max-content auto"')
    app-dialog-bar(@close='close()')
      | {{$t('ui.select_currency')}}

    .grid-fill-height.scrolling(style='min-height:400px')
      v-list.members-list(style='background: transparent;')
        template(v-for='({text, value}, index) in items')
          v-divider(v-if='index !== 0')
          v-list-tile.px-2(:key='value' @click='select(value)')
            v-list-tile-content
              v-list-tile-title {{text}}
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
import { currencies } from '~/../meta/currencies'
import Dialog from '../global/Dialog.vue'

@Component
export default class CurrencySelectDialog extends Vue {
  get items() {
    return currencies.map(c => ({ text: `${c.cc} - ${c.name} (${c.symbol})`, value: c.cc }))
  }

  resolve: ((result?: string) => void) | null = null
  reject: ((error) => void) | null = null

  $refs!: {
    dialog: Dialog
  }

  open() {
    return new Promise<string|undefined>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      this.$refs.dialog.open().then(() => this.close())
    })
  }

  select(cc: string) {
    if (this.resolve)
      this.resolve(cc)
    this.resolve = null
    this.$refs.dialog.close()
  }

  close() {
    if (this.resolve)
      this.resolve()
    this.resolve = null
    this.$refs.dialog.close()
  }
}
</script>
