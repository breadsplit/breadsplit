<template lang='pug'>
v-card
  v-toolbar(:dark='isDark', :color='book.color')
    v-btn(icon, dark, @click='close(false)')
      v-icon mdi-close
    v-toolbar-title New Book
  v-container
    v-flex
      v-text-field(v-model='book.name', label='New Book Name',prepend-icon='mdi-book-open-variant')
      app-swatches(v-model='book.color')
    v-flex
      v-autocomplete(
        v-model='book.currency', :items='currency_code_name', prepend-icon='mdi-currency-usd',label='Choose Currency')
    v-flex
      v-combobox(v-model='member', :items='member_suggestions', :search-input.sync='search', hide-selected='', label='Add New Member',
      multiple='', persistent-hint='', small-chips='',prepend-icon='mdi-account-multiple')
        template(v-slot:no-data='')
          v-list-tile
            v-list-tile-content
              v-list-tile-title
                | No results matching&nbsp;
                strong {{ search }}
                | . Press
                kbd enter
                |  to create a new one
      v-btn(@click='create()', :color='book.color', :dark='isDark') Create

</template>

<script>
import swatches from '~/meta/swatches'
import currency from '~/meta/currency'

export default {
  data() {
    return {
      book: {
        name: '',
        color: swatches[Math.floor(Math.random() * swatches.length)],
      },
      member: [],
      member_suggestions: ['anthony', 'alex'],
    }
  },
  computed: {
    isDark() {
      return this.$utils.isDark(this.book.color)
    },
    currency_code_name() {
      return currency.map(c => ({ text: `${c.cc} - ${c.name} (${c.symbol})`, value: c.cc }))
    },
  },
  methods: {
    close(result) {
      this.$emit('close', result)
    },
    create() {
      // TODO:wayne gather the data from user input
      const payload = {
        name: this.book.name,
        icon: 'mdi-book',
        member: [],
        currencies: ['usd'],
      }
      // "dispatch" refers to Vuex 'actions', please check out Vuex docs
      this.$store.dispatch('book/new', payload)

      this.close()
    },
  },
}
</script>
