<template lang='pug'>
style.
  :root {
    --app-font: {{localeFont}};
    --theme-primary: {{primaryColor}};
  }
  .v-application .primary {
    background-color: var(--theme-primary) !important;
    border-color: var(--theme-primary) !important;
  }
  .v-application .primary--text {
    color: var(--theme-primary) !important;
    caret-color: var(--theme-primary) !important;
  }
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
import FontFamilyBuilder from '~/../meta/font_family'

@Component
export default class GlobalStyle extends Vue {
  get localeFont() {
    const font_of_locale = this.$t('css.font_of_locale', '').toString()
    return FontFamilyBuilder(font_of_locale)
  }

  get primaryColor() {
    return this.$store.getters.primary
  }

  get theme() {
    return this.$vuetify.theme.currentTheme
  }
}
</script>
