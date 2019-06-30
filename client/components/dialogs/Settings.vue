<template lang='pug'>
v-card.settings
  app-dialog-bar(@close='close()', attached)
    | {{$t('ui.settings')}}

  v-container.pt-0.pb-1(ref='container', :class='{"px-0": isMobile, "px-3": !isMobile}')
    v-list(two-line, subheader)
      v-subheader {{$t('ui.general')}}
      v-divider
      v-list-item(@click='darkMode=!darkMode')
        v-list-item-avatar
          v-icon {{ darkMode ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}
        v-list-item-content
          v-list-item-title {{$t('ui.setting_options.dark_mode')}}
          v-list-item-subtitle {{ darkMode ? $t('ui.setting_options.enabled') : $t('ui.setting_options.disabled') }}
        v-list-item-action
          v-switch(color='primary', :input-value='darkMode')
      v-list-item(@click='languageSelecting=true')
        v-list-item-avatar
          v-icon mdi-web
        v-list-item-content
          v-list-item-title {{$t('ui.language')}}
          v-list-item-subtitle {{currentLocaleDisplay}}

      v-list-item(@click='notificationButton()')
        template(v-if='!notificationEnabled')
          v-list-item-avatar
            v-icon mdi-bell-off-outline
          v-list-item-content
            v-list-item-title {{$t('ui.setting_options.notification')}}
            v-list-item-subtitle {{$t('ui.setting_options.notification_disabled')}}
        template(v-else)
          v-list-item-avatar
            v-icon mdi-bell-ring
          v-list-item-content
            v-list-item-title {{$t('ui.setting_options.notification')}}
            v-list-item-subtitle {{$t('ui.setting_options.notification_enabled')}}

    v-list(two-line, subheader)
      v-subheader {{$t('ui.advance')}}
      v-divider
      v-list-item(@click='purgeData')
        v-list-item-avatar
          v-icon mdi-alert-box
        v-list-item-content
          v-list-item-title {{$t('ui.setting_options.reset')}}
          v-list-item-subtitle {{$t('ui.setting_options.clear_all_data')}}

    v-list(two-line, subheader)
      v-subheader {{$t('ui.misc')}}
      v-divider

      v-list-item(@click='openDialog("faq")')
        v-list-item-avatar
          v-icon mdi-help-circle-outline
        v-list-item-content
          v-list-item-title {{$t('ui.faq')}}

      v-list-item(@click='$refs.feedback.open()')
        v-list-item-avatar
          v-icon mdi-message-alert-outline
        v-list-item-content
          v-list-item-title {{$t('ui.feedback')}}

      v-list-item(@click='openDialog("about")')
        v-list-item-avatar
          v-icon mdi-information-outline
        v-list-item-content
          v-list-item-title {{$t('ui.about')}}

  v-bottom-sheet(v-model='languageSelecting')
    v-list.pl-3.pt-3.pb-3
      v-list-item.pa-1(v-for='locale in localeItems', :key='locale.value', @click='switchLocale(locale.value)')
        v-list-item-title {{ locale.text }}
        v-list-item-action(v-if='locale.value === currentLocale')
          v-icon mdi-check

  app-dialog(ref='feedback' :route='true')
    app-feed-back
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { AvaliableLocales } from '~/locales'
import { NavigationMixin, CommonMixin, DialogChildMixin } from '~/mixins'

const localeItems = AvaliableLocales.map(l => ({ value: l.code, text: l.display }))

@Component
export default class Settings extends mixins(CommonMixin, NavigationMixin, DialogChildMixin) {
  localeItems = localeItems
  languageSelecting = false

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

  switchLocale(locale) {
    this.$store.commit('switchLocale', locale)
    this.$i18n.locale = locale
    this.languageSelecting = false
  }

  async purgeData() {
    if (await this.$confirm(this.$t('prompt.are_you_sure'))) {
      await this.$fire.logout()
      this.$store.commit('purge')
      this.close()
      this.gotoHome()
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
      this.$snack('Messaging token copied')
    }
  }
}
</script>

<style lang='sass'>
.settings
  .v-list, .v-list *
    transition: 0.3s background cubic-bezier(0.25, 0.8, 0.5, 1)
</style>
