<template lang='pug'>
v-card
  v-toolbar(dark, color='primary')
    v-btn(icon, dark, @click='close()')
      v-icon close
    v-toolbar-title {{$t('ui.settings')}}
  v-container
    v-subheader {{$t("ui.language")}}
    v-layout.px-3
      v-flex(xs12)
        v-select(
          solo
          prepend-inner-icon='mdi-web'
          :value='currentLocale'
          @input='changeLocale'
          :items='locales'
          :label='$t("ui.language")'
          required
        )

    v-divider

    v-layout.px-3
      v-flex(xs12).text-xs-center
        v-btn.my-3(color='red', dark, @click='purgeData') Clear All Data
</template>

<script>
import locales from '~/locales'

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
    close() {
      this.$emit('close')
    },
    changeLocale(locale) {
      this.$store.dispatch('switchLocale', locale)
      this.$i18n.locale = locale
    },
    purgeData() {
      if (confirm('Sure?'))
        this.$store.commit('book/purge')
      this.close()
      this.$router.push('/')
    },
  },
}
</script>
