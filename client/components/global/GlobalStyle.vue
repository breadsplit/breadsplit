<template lang='pug'>
style.
  :root {
    --app-font: {{localeFont}};
  }
  .primary {
    background-color: {{primaryColor}} !important;
    border-color: {{primaryColor}} !important;
  }
  .primary--text {
    color: {{primaryColor}} !important;
    caret-color: {{primaryColor}} !important;
  }
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
import FontFamilyBuilder from '~/meta/font_family'

@Component
export default class GlobalStyle extends Vue {
  get localeFont() {
    const font_of_locale = this.$t('css.font_of_locale', '').toString()
    return FontFamilyBuilder(font_of_locale)
  }

  get primaryColor() {
    return this.$store.getters.primary
  }
}
</script>
