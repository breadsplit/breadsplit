<template lang='pug'>
v-form
  v-container
    v-layout(column, justify-center, align-center)
      v-flex.text-xs-center(xs12, md4)
         v-select(:value='currentLocale'
            @input='changeLocale'
            :items='locales'
            :label='$t("ui.language")'
            required)

</template>

<script>
import locales from '@/locales'

export default {
  data() {
    return {
      locales: locales.locales.map(l => ({ value: l.code, text: l.display })),
    }
  },
  computed: {
    currentLocale() {
      return this.$i18n.locale || 'en'
    },
  },
  methods: {
    changeLocale(locale) {
      this.$store.dispatch('switchLocale', locale)
      this.$i18n.locale = locale
    },
  },
}
</script>
