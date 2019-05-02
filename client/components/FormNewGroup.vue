<template lang='pug'>
v-card
  v-toolbar(dark, :color='color')
    v-btn(icon, dark, @click='close(false)')
      v-icon mdi-close
    v-toolbar-title New Group

  v-container.pa-4
    v-layout(column)
      v-flex
        v-text-field(
          v-model='name' label='Group name'
          prepend-icon='mdi-group-open-variant'
        )
          template(slot='prepend')
            app-icon-select(:icon.sync='icon' :color.sync='color', style='margin-top:-20px')

      v-flex
        v-autocomplete(
          v-model='currency' :items='currencies'
          prepend-icon='mdi-currency-usd' label='Currency'
        )

      v-flex
        v-combobox(
          v-model='members', :items='members_suggestions'
          :search-input.sync='search', hide-selected
          label='Members', multiple, persistent-hint
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
                  | to create a new one

      v-flex
        v-btn(@click='create()', :color='color', dark) Create

</template>

<script>
import swatches from '~/meta/swatches'
import currencies from '~/meta/currencies'

export default {
  data() {
    return {
      search: '',
      currency: '',
      icon: 'account-group',
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
      // TODO: load suggestions from another group
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
        icon: this.icon,
        members: this.members.map((m) => { return { name: m } }),
        currencies: [this.currency],
      }
      this.$store.commit('group/add', payload)

      this.close()
    },
  },
}
</script>
