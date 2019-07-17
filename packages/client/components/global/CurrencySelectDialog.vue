<template lang='pug'>
app-dialog(ref='dialog' width='350')
  v-card.currency-select-dialog(v-rows='"max-content max-content auto"')
    app-dialog-bar(@close='close()')
      | {{$t('ui.select_currency')}}

    v-text-field(
      v-model='search'
      :placeholder='$t("ui.search_currency")'
      solo hide-details clearable
      @keydown.enter='enter()'
    )

    .grid-fill-height.scrolling(style='min-height:400px')
      v-list.members-list(style='background: transparent;')
        template(v-for='({text, value}, index) in result')
          v-divider(v-if='index !== 0')
          v-list-item.px-2(:key='value' @click='select(value)')
            v-list-item-content
              v-list-item-title {{text}}
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
import Dialog from '../global/Dialog.vue'
import { currencies } from '~/../meta/currencies'

@Component
export default class CurrencySelectDialog extends Vue {
  get items () {
    return currencies.map(c => ({ text: `${c.cc} - ${c.name} (${c.symbol})`, value: c.cc }))
  }

  get result () {
    if (!this.search)
      return this.items
    const regex = new RegExp(`${this.search}`, 'gi')
    return this.items.filter(i => i.text.match(regex))
  }

  resolve: ((result?: string) => void) | null = null
  reject: ((error) => void) | null = null
  search: string = ''

  $refs!: {
    dialog: Dialog
  }

  open () {
    this.search = ''
    return new Promise<string|undefined>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      this.$refs.dialog.open().then(() => this.close())
    })
  }

  select (cc: string) {
    if (this.resolve)
      this.resolve(cc)
    this.resolve = null
    this.$refs.dialog.close()
  }

  close () {
    if (this.resolve)
      this.resolve()
    this.resolve = null
    this.$refs.dialog.close()
  }

  enter () {
    if (this.result.length === 1)
      this.select(this.result[0].value)
  }
}
</script>
