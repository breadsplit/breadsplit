<template lang='pug'>
v-card
  app-dialog-bar(@close='close()' :color='color')
    | {{$t('ui.group_editing.new_group')}}

  v-container.pa-4
    v-layout(column)
      v-flex
        v-text-field(
          v-model='name' :label='$t("ui.group_editing.group_name")'
          prepend-icon='mdi-group-open-variant' clearable
        )
          template(slot='prepend')
            app-icon-select(:icon.sync='icon' :color.sync='color', style='margin-top:-20px')

      v-flex
        v-autocomplete(
          v-model='currency' :items='currencies'
          prepend-icon='mdi-currency-usd' label='Currency' clearable
        )

      v-flex
        v-combobox(
          v-model='members', :items='members_suggestions'
          :search-input.sync='search', hide-selected
          label='Members', multiple, persistent-hint
          small-chips, prepend-icon='mdi-account-multiple' clearable
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
        v-btn(@click='create()', :color='color', :dark='submitFlag', :disabled='!submitFlag') {{$t('ui.button_create')}}
        v-btn(@click='close(false)', flat, color='grey') {{$t('ui.button_cancel')}}

</template>

<script lang='ts'>
import swatches from '~/meta/swatches'
import currencies from '~/meta/currencies'
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class FromNewGroup extends Vue {
  search = ''
  currency = ''
  icon = 'account-group'
  name = ''
  color = swatches[Math.floor(Math.random() * swatches.length)]
  members = []

  get currencies() {
    return currencies.map(c => ({ text: `${c.cc} - ${c.name} (${c.symbol})`, value: c.cc }))
  }
  get members_suggestions() {
    // TODO: load suggestions from another group
    return []
  }
  get submitFlag(): boolean {
    return !!(this.name.length && this.currency.length && this.members.length)
  }

  close(result?) {
    this.$emit('close', result)
  }
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
    // Switch to new created group
    const id = this.$store.state.group.currentId
    this.$router.push(`/group/${id}`)
  }
}
</script>
