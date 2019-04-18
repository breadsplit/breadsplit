<template lang='pug'>
v-card
  v-toolbar(dark, color='primary')
    v-btn(icon, dark, @click='close()')
      v-icon mdi-close
    v-toolbar-title {{$t('ui.settings')}}

  v-container.px-0
    v-list(two-line, subheader)
      v-subheader General
      v-list-tile(avatar, @click='language_select=true')
        v-list-tile-avatar
          v-icon mdi-web
        v-list-tile-content
          v-list-tile-title {{$t("ui.language")}}
          v-list-tile-sub-title {{currentLocaleDisplay}}
      v-list-tile(avatar, @click='')
        v-list-tile-avatar
          v-icon mdi-bell
        v-list-tile-content
          v-list-tile-title Enable Notifications
          v-list-tile-sub-title Notifications are disabled.

    v-divider

    v-list(two-line, subheader)
      v-subheader {{$t("ui.advance")}}
      v-list-tile(avatar, @click='purgeData')
        v-list-tile-avatar
          v-icon mdi-alert-box
        v-list-tile-content
          v-list-tile-title Reset
          v-list-tile-sub-title Clear all Data

    app-credit

  v-bottom-sheet(v-model='language_select')
    v-list.pl-3.pt-3.pb-3
      v-list-tile.pa-1(v-for='locale in locales', :key='locale.value', avatar, @click='switchLocale(locale.value)')
        v-list-tile-title {{ locale.text }}
        v-list-tile-action(v-if='locale.value === currentLocale')
          v-icon mdi-check
</template>

<script>
import locales from '~/locales'
import version from '~/version'

export default {
  data() {
    return {
      version,
      locales: locales.locales.map(l => ({ value: l.code, text: l.display })),
      language_select: false,
    }
  },
  computed: {
    currentLocale() {
      return this.$i18n.locale || 'en'
    },
    currentLocaleDisplay() {
      return (this.locales.find(l => l.value === this.currentLocale) || {}).text || this.currentLocale
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    switchLocale(locale) {
      this.$store.commit('switchLocale', locale)
      this.$i18n.locale = locale
      this.language_select = false
    },
    async purgeData() {
      if (await this.$root.$confirm(this.$t('prompt.are_you_sure'))) {
        this.$store.commit('book/purge')
        this.close()
        this.$router.push('/')
      }
    },
  },
}
</script>
