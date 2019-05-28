<template lang='pug'>
v-card.new-group
  app-dialog-bar(@close='close()' :color='color')
    | {{title}}

  v-window.height-100(v-model='step', touchless)
    // First page
    v-window-item(:value='1')
      v-container.pa-4
        v-layout(column)
          v-flex
            v-text-field(
              v-model='form.name' :label='$t("ui.group_editing.group_name")'
              prepend-icon='mdi-group-open-variant' clearable :disabled='viewmode'
              autofocus
            )
              template(slot='prepend')
                app-icon-select(:icon.sync='icon' :color.sync='color', style='margin-top:-20px')

          v-flex
            v-autocomplete(
              v-model='form.currencies[0]' :items='currency_list'
              prepend-icon='mdi-currency-usd' label='Currency' :disabled='viewmode'
            )

    // Second page
    v-window-item(:value='2')
      v-container.pa-4
        v-layout(column)
          v-flex
            v-combobox(
              v-model='members', :items='members_suggestions'
              :search-input.sync='search', hide-selected
              label='Members', multiple, persistent-hint
              small-chips, deletable-chips, prepend-icon='mdi-account-multiple' clearable :disabled='viewmode' autofocus
            )
              template(v-slot:no-data='')
                v-list-tile
                  v-list-tile-content
                    v-list-tile-title
                      | No results matching&nbsp;
                      strong {{ search }}
                      | . Press
                      kbd enter
                      | to create a new one  div
    v-divider
    v-card-actions.pa-3
      v-spacer
      template(v-if='step === 1 && !mode')
        v-btn(@click='close(false)', depressed, color='grey') {{$t('ui.button_cancel')}}
        v-btn(@click='step++', :color='color', :disabled='checkEmpty')  {{$t('ui.button_next')}}
      template(v-if='step === 2 && !mode')
        v-btn(@click='step--', color='grey') {{$t('ui.button_back')}}
        v-btn(@click='create()', :color='color', :disabled='checkEmpty') {{$t('ui.button_create')}}
      template(v-if='mode')
        v-btn(@click='close(false)', depressed, color='grey') {{$t('ui.button_cancel')}}
        v-btn(@click='edit()', :color='color', :disabled='checkEmpty') {{$t('ui.button_confirm')}}
</template>

<script lang='ts'>
import swatches from '~/../meta/swatches'
import { getCommonCurrencyCodes, getLocaleCurrencies } from '~/../meta/currencies'
import { Component, Getter, mixins } from 'nuxt-property-decorator'
import { DialogChildMixin } from '~/mixins'
import { TranslateResult } from 'vue-i18n'
import { Group, UserInfo, GroupMetaChanges } from '~/types'
import { IdMe, GroupDefault, defaultCurrency } from '~/core'

@Component
export default class NewGroup extends mixins(DialogChildMixin) {
  form: Group = GroupDefault()
  search = ''
  step = 1
  mode = ''
  icon = 'account-group'
  color = swatches[Math.floor(Math.random() * swatches.length)]
  members = []

  @Getter('locale') locale!: string
  @Getter('group/current') current: Group | undefined
  @Getter('user/me') user!: UserInfo
  @Getter('user/uid') uid: string | undefined

  reset() {
    this.$set(this, 'form', GroupDefault())
    if (this.options.mode) {
      if (this.current) {
        this.form.name = this.current.name
        this.form.currencies[0] = this.current.currencies[0]
        this.icon = this.current.icon || ''
        this.color = this.current.color || ''
        this.mode = this.options.mode
        // @ts-ignore
        Object.values(this.current.members).forEach((m) => { this.members.push(m.name) })
      }
    }
    else {
      this.form.currencies[0] = this.codes[0] || defaultCurrency
    }
  }

  get title(): TranslateResult {
    if (!this.mode) return this.$t('ui.group_editing.new_group')
    else if (this.mode === 'edit') return this.$t('ui.menu.edit_group')
    else if (this.mode === 'view') return this.$t('ui.menu.view_group')
    else return this.$t('ui.group_editing.default_group_name')
  }

  get viewmode() {
    return this.mode === 'view'
  }

  get codes() {
    return getCommonCurrencyCodes(this.locale)
  }

  get currency_list() {
    return getLocaleCurrencies(this.locale, this.codes)
      .map(c => ({ text: `${c.cc} - ${c.name} (${c.symbol})`, value: c.cc }))
  }

  get members_suggestions() {
    // TODO: load suggestions from another group
    return []
  }
  get checkEmpty(): boolean {
    const hasEmpty = !(this.form.name && this.form.currencies[0])
    return hasEmpty || this.viewmode
  }

  defaultMember(m) {
    m.push({ uid: IdMe })
  }

  create() {
    const payload = {
      name: this.form.name,
      color: this.color,
      icon: this.icon,
      members: this.members.map((m) => { return { name: m } }),
      currencies: this.form.currencies,
    }
    this.defaultMember(payload.members)
    this.$store.dispatch('group/add', payload)
    this.close()
    // Switch to new created group
    const id = this.$store.state.group.currentId
    this.$router.push(`/group/${id}`)
  }
  edit() {
    const payload: GroupMetaChanges = {
      name: this.form.name,
      color: this.color,
      icon: this.icon,
      currencies: this.form.currencies,
    }
    this.$store.dispatch('group/modify', { changes: payload })
    this.close()
  }
}
</script>
