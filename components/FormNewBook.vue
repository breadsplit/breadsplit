<template lang='pug'>
v-card
  v-toolbar(:dark='isDark', :color='color')
    v-btn(icon, dark, @click='close(false)')
      v-icon mdi-close
    v-toolbar-title New Book

  v-container
    v-flex
      v-text-field(v-model='name', label='New Book Name',prepend-icon='mdi-book-open-variant')
      app-swatches(v-model='color')

    v-flex
      v-autocomplete(
        v-model='currency', :items='currencies', prepend-icon='mdi-currency-usd',label='Choose Currency')

    v-flex
      v-combobox(
        v-model='members', :items='members_suggestions'
        :search-input.sync='search', hide-selected
        label='Add New Member', multiple, persistent-hint
        small-chips, prepend-icon='mdi-account-multiple'
      )
        template(v-slot:no-data='')
          v-list-tile
            v-list-tile-content
              v-list-tile-title
                | No results matching&nbsp;
                strong {{ search }}
                | . Press
                kbd enter
                |  to create a new one

      v-btn(@click='create()', :color='color', :dark='isDark') Create

</template>

<script>
import swatches from '~/meta/swatches'
import currencies from '~/meta/currencies'

export default {
  data() {
    return {
      search: '',
      currency: '',
      name: '',
      color: swatches[Math.floor(Math.random() * swatches.length)],
      members: [],
    }
  },
  computed: {
    isDark() {
      return this.$utils.isDark(this.color)
    },
    currencies() {
      return currencies.map(c => ({ text: `${c.cc} - ${c.name} (${c.symbol})`, value: c.cc }))
    },
    members_suggestions() {
      // TODO: load suggestions from another book
      return []
    },
  },
  methods: {
    close(result) {
      this.$emit('close', result)
    },
    create() {
      const payload = {
        name: this.name,
        color: this.color,
        icon: 'mdi-book',
        members: this.members.map((m) => { return { name: m } }),
        currencies: [this.currency],
      }
      this.$store.commit('book/add', payload)

      this.close()
    },
  },
}
</script>
