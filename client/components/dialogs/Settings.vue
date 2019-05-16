<template lang='pug'>
v-card.settings
  app-dialog-bar(@close='close()')
    | {{$t('ui.settings')}}

  v-container(ref='container', :class='{"px-0": isMobile}')
    v-list(two-line, subheader)
      v-subheader {{$t('ui.general')}}
      v-divider
      v-list-tile(avatar, @click='darkMode=!darkMode')
        v-list-tile-avatar
          v-icon {{ darkMode ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}
        v-list-tile-content
          v-list-tile-title {{$t('ui.setting_options.dark_mode')}}
          v-list-tile-sub-title {{ darkMode ? $t('ui.setting_options.enabled') : $t('ui.setting_options.disabled') }}
        v-list-tile-action
          v-switch(color='primary', :input-value='darkMode')
      v-list-tile(avatar, @click='languageSelecting=true')
        v-list-tile-avatar
          v-icon mdi-web
        v-list-tile-content
          v-list-tile-title {{$t('ui.language')}}
          v-list-tile-sub-title {{currentLocaleDisplay}}

      v-list-tile(avatar, @click='notificationButton()')
        template(v-if='!notificationEnabled')
          v-list-tile-avatar
            v-icon mdi-bell-off-outline
          v-list-tile-content
            v-list-tile-title {{$t('ui.setting_options.notification')}}
            v-list-tile-sub-title {{$t('ui.setting_options.notification_disabled')}}
        template(v-else)
          v-list-tile-avatar
            v-icon mdi-bell-ring
          v-list-tile-content
            v-list-tile-title {{$t('ui.setting_options.notification')}}
            v-list-tile-sub-title {{$t('ui.setting_options.notification_enabled')}}

    v-list(two-line, subheader)
      v-subheader {{$t('ui.advance')}}
      v-divider
      v-list-tile(avatar, @click='purgeData')
        v-list-tile-avatar
          v-icon mdi-alert-box
        v-list-tile-content
          v-list-tile-title {{$t('ui.setting_options.reset')}}
          v-list-tile-sub-title {{$t('ui.setting_options.clear_all_data')}}

    v-list(two-line, subheader)
      v-subheader {{$t('ui.misc')}}
      v-divider

      v-list-tile(avatar, @click='WIP')
        v-list-tile-avatar
          v-icon mdi-help-circle-outline
        v-list-tile-content
          v-list-tile-title {{$t('ui.help')}}

      v-list-tile(avatar, @click='WIP')
        v-list-tile-avatar
          v-icon mdi-message-alert-outline
        v-list-tile-content
          v-list-tile-title {{$t('ui.feedback')}}

      v-list-tile(avatar, @click='$root.$about.open')
        v-list-tile-avatar
          v-icon mdi-information-outline
        v-list-tile-content
          v-list-tile-title {{$t('ui.about')}}

  v-bottom-sheet(v-model='languageSelecting')
    v-list.pl-3.pt-3.pb-3
      v-list-tile.pa-1(v-for='locale in localeItems', :key='locale.value', avatar, @click='switchLocale(locale.value)')
        v-list-tile-title {{ locale.text }}
        v-list-tile-action(v-if='locale.value === currentLocale')
          v-icon mdi-check
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import { AvaliableLocales } from '~/locales'
import CommonMixin from '~/mixins/common'

const localeItems = AvaliableLocales.map(l => ({ value: l.code, text: l.display }))

@Component
export default class Settings extends Mixins(CommonMixin) {
  localeItems = localeItems
  languageSelecting = false

  get currentLocale() {
    return this.$i18n.locale || 'en'
  }
  get currentLocaleDisplay() {
    const locale = localeItems.find(l => l.value === this.currentLocale)
    if (locale && locale.text)
      return locale.text
    return this.currentLocale
  }
  get darkMode() {
    return this.$store.getters.dark
  }
  set darkMode(value) {
    this.$store.commit('dark', value)
  }
  get notificationEnabled() {
    return this.$store.state.messaging_token
  }

  close() {
    this.$emit('close')
  }

  switchLocale(locale) {
    this.$store.commit('switchLocale', locale)
    this.$i18n.locale = locale
    this.languageSelecting = false
  }

  async purgeData() {
    // @ts-ignore
    if (await this.$root.$confirm(this.$t('prompt.are_you_sure'))) {
      await this.$fire.logout()
      this.$store.commit('purge')
      this.close()
      this.$router.push('/')
    }
  }

  async notificationButton() {
    if (!this.notificationEnabled) {
      await this.$fire.requestNotificationPermission()
    }
    else {
      const token = this.$store.state.messaging_token
      // @ts-ignore
      await this.$copyText(token, this.$refs.container)
      this.$root.$snack('Messaging token copied')
    }
  }
}
</script>

<style lang='stylus'>
.settings
  .v-list, .v-list *
    transition 0.3s background cubic-bezier(0.25, 0.8, 0.5, 1)
</style>
