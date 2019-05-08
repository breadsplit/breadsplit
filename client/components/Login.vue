<template lang='pug'>
v-card.login
  v-toolbar(dark, color='primary')
    //- v-btn(icon, dark, @click='close()')
    v-toolbar-title {{$t('appname')}}
  v-container
    v-layout(column).pd-4
      v-flex(mx-auto)
        v-img(:src='require("../assets/img/toast.jpg")')
        v-card-text {{$t('ui.signin_options.tip')}}
      v-flex(mx-auto my-1)
        app-brand-button(brand='google' @click='loginWith("google")' large width='220px')
          span {{$t('ui.signin_options.Google')}}
      v-flex(mx-auto my-1)
        app-brand-button(brand='facebook' @click='loginWith("facebook")' large width='220px')
          span {{$t('ui.signin_options.Facebook')}}
      v-flex(mx-auto my-1)
        app-brand-button(brand='github_dark' @click='loginWith("github")' large width='220px')
          span {{$t('ui.signin_options.Github')}}
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { AvaliableLocales } from '~/locales'

const localeItems = AvaliableLocales.map(l => ({ value: l.code, text: l.display }))

@Component
export default class Login extends Vue {
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

  async loginWith(provider: 'google'|'facebook'|'github') {
    // TODO:CODE: error handling
    await this.$fire.loginWith(provider)
    this.close()
  }
}
</script>

<style lang='stylus'>
.login
  .v-flex, .v-flex *
    transition 0.3s background cubic-bezier(0.25, 0.8, 0.5, 1)
</style>
