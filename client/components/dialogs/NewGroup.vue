<template lang='pug'>
v-card.new-group
  app-dialog-bar(@close='close()' :color='color')
    | {{title}}
  v-container.pa-4
    v-layout(column)
      v-flex
        v-text-field(
          v-model='name' :label='$t("ui.group_editing.group_name")'
          prepend-icon='mdi-group-open-variant' clearable :disabled='viewmode'
        )
          template(slot='prepend')
            app-icon-select(:icon.sync='icon' :color.sync='color', style='margin-top:-20px')

      v-flex
        v-autocomplete(
          v-model='currency' :items='currencies'
          prepend-icon='mdi-currency-usd' label='Currency' clearable :disabled='viewmode'
        )

      v-flex
        v-combobox(
          v-model='members', :items='members_suggestions'
          :search-input.sync='search', hide-selected
          label='Members', multiple, persistent-hint
          small-chips, deletable-chips, prepend-icon='mdi-account-multiple' clearable :disabled='viewmode'
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
        v-btn(@click='create()', :color='color', :disabled='checkEmpty') {{submitBtnName}}
        v-btn(@click='close(false)', flat, color='grey') {{$t('ui.button_cancel')}}

</template>

<script lang='ts'>
import swatches from '~/meta/swatches'
import currencies from '~/meta/currencies'
import { Component, Mixins } from 'vue-property-decorator'
import { DialogChildMixin } from '~/mixins'
import { TranslateResult } from 'vue-i18n'

@Component
export default class NewGroup extends Mixins(DialogChildMixin) {
  search = ''
  mode = ''
  name = ''
  currency = ''
  icon = 'account-group'
  color = swatches[Math.floor(Math.random() * swatches.length)]
  viewmode = false
  members = []

  reset() {
    if (this.options.mode) {
      this.mode = this.options.mode
      this.name = this.options.name
      this.currency = this.options.currency
      // @ts-ignore
      Object.values(this.options.members).forEach((m) => { this.members.push(m.name) })
      this.viewmode = this.mode === 'view'
      this.icon = this.options.icon
      this.color = this.options.color
    }
  }

  get title(): TranslateResult {
    if (!this.mode) return this.$t('ui.group_editing.new_group')
    else if (this.mode === 'edit') return this.$t('ui.menu.edit_group')
    else if (this.mode === 'view') return this.$t('ui.menu.view_group')
    else return this.$t('ui.group_editing.default_group_name')
  }

  get submitBtnName(): TranslateResult {
    if (this.mode)
      return this.$t('ui.button_confirm')
    else
      return this.$t('ui.button_create')
  }

  get currencies() {
    return currencies.map(c => ({ text: `${c.cc} - ${c.name} (${c.symbol})`, value: c.cc }))
  }

  get members_suggestions() {
    // TODO: load suggestions from another group
    return []
  }
  get checkEmpty(): boolean {
    const hasEmpty = !(this.name && this.currency)
    return hasEmpty || this.viewmode
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
    if (this.mode) {
      // TODO: update group implement
      this.close()
    }
    else {
      this.$store.commit('group/add', payload)
      this.close()
    }
    // Switch to new created group
    const id = this.$store.state.group.currentId
    this.$router.push(`/group/${id}`)
  }
}
</script>
