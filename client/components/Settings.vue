<template lang='pug'>
v-card.settings
  v-toolbar(dark, color='primary')
    v-btn(icon, dark, @click='close()')
      v-icon mdi-close
    v-toolbar-title {{$t('ui.settings')}}

  v-container.px-0
    v-list(two-line, subheader)
      v-subheader {{$t("ui.general")}}
      v-divider
      v-list-tile(avatar)
        v-list-tile-avatar
          v-icon {{ darkMode ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}
        v-list-tile-content
          v-list-tile-title {{$t("ui.dark_mode")}}
          v-list-tile-sub-title {{ darkMode ? 'Enabled' : 'Disabled' }}
        v-switch(color='green', v-model='darkMode')
      v-list-tile(avatar, @click='languageSelecting=true')
        v-list-tile-avatar
          v-icon mdi-web
        v-list-tile-content
          v-list-tile-title {{$t("ui.language")}}
          v-list-tile-sub-title {{currentLocaleDisplay}}
      v-list-tile(avatar, @click='')
        v-list-tile-avatar
          v-icon mdi-bell
        v-list-tile-content
          v-list-tile-title {{$t("ui.notification")}}
          v-list-tile-sub-title Notifications are disabled.

    v-list(two-line, subheader)
      v-subheader {{$t("ui.advance")}}
      v-divider
      v-list-tile(avatar, @click='purgeData')
        v-list-tile-avatar
          v-icon mdi-alert-box
        v-list-tile-content
          v-list-tile-title {{$t("ui.reset")}}
          v-list-tile-sub-title Clear all Data

    app-credit

  v-bottom-sheet(v-model='languageSelecting')
    v-list.pl-3.pt-3.pb-3
      v-list-tile.pa-1(v-for='locale in localeItems', :key='locale.value', avatar, @click='switchLocale(locale.value)')
        v-list-tile-title {{ locale.text }}
        v-list-tile-action(v-if='locale.value === currentLocale')
          v-icon mdi-check
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { AvaliableLocales } from '../locales'

const localeItems = AvaliableLocales.map(l => ({ value: l.code, text: l.display }))

@Component
export default class Settings extends Vue {
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
}
</script>

<style lang="stylus">
.settings
  .v-list, .v-list *
    transition 0.3s background cubic-bezier(0.25, 0.8, 0.5, 1)
</style>
