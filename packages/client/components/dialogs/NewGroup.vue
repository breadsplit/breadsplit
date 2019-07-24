<template lang='pug'>
v-card.new-group(v-rows='"max-content max-content auto max-content"')
  app-composed-toolbar(height='130' dark :color='form.color')
    v-btn(icon @click='close()')
      v-icon mdi-close
    v-toolbar-title {{title}}
    v-spacer
    template(v-slot:content='')
      .px-6.py-4
        v-text-field.group-name-input.flat.pl-12(
          v-model='form.name'
          :label='$t("ui.group_editing.group_name")'
          :placeholder='$t("ui.group_editing.group_name_placeholder")'
          :disabled='viewmode'
          :readonly='step !== 1'
          autofocus
        )

  v-scale-transition
    app-icon-color-select(:icon.sync='form.icon' :color.sync='form.color' v-show='step === 1')
      template(v-slot='{ on }')
        v-btn(fab v-on='on' style='position: absolute; right: 20px; margin-top: -25px;')
          v-icon(:color='form.color') mdi-{{form.icon}}

  v-window.height-100.grid-fill-height(v-model='step' touchless style='min-height:300px')
    // First page
    v-window-item(:value='1')
      v-container.pa-4
        v-layout(column).pl-4.pr-4.pt-4
          v-flex
            app-currency-select(v-model='form.main_currency')

          v-flex.my-3
            v-switch(v-model='online')
              template(slot='label')
                span(v-if='online') {{$t('ui.online_mode')}}
                span(v-else) {{$t('ui.offline_mode')}}
                app-help-link(help='online_mode')

    // Second page
    v-window-item(:value='2')
      .height-100.mt-n3(v-rows='"max-content auto"')
        v-combobox.member-name-input.mx-4(
          ref='member_name_input'
          :items='members_suggestions'
          @input='name=>addMember(name)'
          :search-input.sync='search'
          :disabled='viewmode'
          :placeholder='$t("tips.member_name_input_placeholder")'
          append-icon=''
          solo hide-selected hide-details autofocus
        )
          template(v-slot:no-data='')

        .scrolling.grid-fill-height
          div
            v-list.members-list(style='background: transparent')
              template(v-for='(member, index) in members')
                v-list-item.px-4(:key='member.uid')
                  v-list-item-avatar
                    app-user-avatar(:member='member' size='38')
                  v-list-item-content
                    v-list-item-title
                      app-user-info(:member='member', field='name' :fallback='member.name')
                    v-list-item-subtitle.sub-label(style='margin-top: -5px')
                      app-user-info(:member='member', field='email')
                  v-list-item-action(v-if='member.uid !== me')
                    v-btn(icon text @click='removeMember(member.uid)')
                      v-icon.op-75 mdi-close

  div
    v-divider
    v-card-actions.pa-3
      template(v-if='step === 1 && !mode')
        v-btn.px-4.button-cancel(@click='close(false)' text) {{$t('ui.button_cancel')}}
        v-spacer
        v-btn.px-4.button-next(@click='step++' :color='color' :dark='!checkEmpty' depressed :disabled='checkEmpty')  {{$t('ui.button_next')}}

      template(v-if='step === 2 && !mode')
        v-btn.px-4.button-back(@click='step--' text) {{$t('ui.button_back')}}
        v-spacer
        template(v-if='search')
          v-btn.px-4(@click='addMember(search)' dark :color='color' depressed) {{$t('ui.group_editing.add_member_xx', [search])}}

        template(v-if='!search')
          v-btn.px-4.button-create(@click='create()' :color='color' :dark='!checkEmpty' depressed :disabled='checkEmpty')
            v-icon.mr-1(size='20') mdi-check
            | {{$t('ui.button_create_group')}}

      template(v-if='mode')
        v-btn.px-4(@click='close(false)' text) {{$t('ui.button_cancel')}}
        v-spacer
        v-btn.px-4(@click='edit()' :color='color' :dark='!checkEmpty' depressed :disabled='checkEmpty') {{$t('ui.button_confirm')}}
</template>

<script lang='ts'>
import { Component, Getter, mixins } from 'nuxt-property-decorator'
import { TranslateResult } from 'vue-i18n'
import cloneDeep from 'lodash/cloneDeep'
import { MemberDefault } from '../../../core'
import swatches from '~/../meta/swatches'
import { getCommonCurrencyCodes } from '~/../meta/currencies'
import { DialogChildMixin } from '~/mixins'
import { Group, UserInfo } from '~/types'
import { IdMe, GroupDefault, defaultCurrency } from '~/core'

@Component
export default class NewGroup extends mixins(DialogChildMixin) {
  readonly me = IdMe
  form: Group = GroupDefault()
  formOriginal: Group | null = null
  search = ''
  step = 1
  mode = ''
  // TODO:AF make it works
  online = false

  @Getter('locale') locale!: string
  @Getter('group/current') current: Group | undefined
  @Getter('user/me') user!: UserInfo
  @Getter('user/uid') uid: string | undefined

  reset () {
    this.formOriginal = null
    // editing
    if (this.options.mode && this.current) {
      this.formOriginal = Object.freeze(cloneDeep(this.current))
      this.form = cloneDeep(this.current)
    }
    // creating
    else {
      this.$set(this, 'form', GroupDefault({
        icon: 'account-group',
        color: swatches[Math.floor(Math.random() * swatches.length)],
        members: {
          [IdMe]: MemberDefault({
            uid: IdMe,
          }),
        },
      }))
    }

    if (!this.form.main_currency)
      this.form.main_currency = this.codes[0] || defaultCurrency

    this.mode = this.options.mode
    this.step = 1
  }

  get title (): TranslateResult {
    if (this.step === 2)
      return `${this.$t('ui.group_editing.add_members')}(${this.members.length})`
    if (!this.mode)
      return this.$t('ui.group_editing.new_group')
    else if (this.mode === 'edit')
      return this.$t('ui.menu.edit_group')
    else if (this.mode === 'view')
      return this.$t('ui.menu.view_group')
    else
      return this.$t('ui.group_editing.default_group_name')
  }

  get viewmode () {
    return this.mode === 'view'
  }

  get codes () {
    return getCommonCurrencyCodes(this.locale)
  }

  get members () {
    return Object.values(this.form.members)
  }

  get color () {
    return this.form.color
  }

  get members_suggestions () {
    // TODO: load suggestions from another group
    return []
  }

  get checkEmpty (): boolean {
    const hasEmpty = !(this.form.name && this.form.main_currency)
    return hasEmpty || this.viewmode
  }

  defaultMember (m) {
    m.push({ uid: IdMe })
  }

  create () {
    this.$store.dispatch('group/add', this.form)
    this.close()
    // Switch to new created group
    const id = this.$store.state.group.currentId
    this.$router.push(`/group/${id}`)
  }

  addMember (name: string) {
    if (name && !this.members.find(m => m.name === name)) {
      const member = MemberDefault({
        name,
      })
      // @ts-ignore
      this.$set(this.form.members, member.uid, member)
    }
    setTimeout(() => {
      this.search = ''
      // @ts-ignore
      this.$refs.member_name_input.focus()
      // @ts-ignore
      this.$refs.member_name_input.lazyValue = ''
    }, 1)
  }

  removeMember (uid: string) {
    this.$delete(this.form.members, uid)
  }

  edit () {
    if (!this.formOriginal)
      return
    // only following fields can be modified in this form
    const picking = ['name', 'main_currency', 'color', 'icon']
    const changes: object = {}
    for (const key of picking) {
      if (this.form[key] !== this.formOriginal[key])
        changes[key] = this.form[key]
    }
    if (Object.keys(changes).length)
      this.$store.dispatch('group/modify', { changes })
    this.close()
  }
}
</script>
