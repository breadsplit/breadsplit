<template lang='pug'>
v-card(:dark='dark').login
  v-toolbar(dark, color='primary')
    //- v-btn(icon, dark, @click='close()')
    v-toolbar-title {{$t('appname')}}
  v-container
    v-layout(column).pd-4
      v-flex(mx-auto)
        v-img(:src='require("../assets/img/toast.jpg")')
        v-card-text 登入您的帳戶，以啟用備分與同步功能
      v-flex(mx-auto my-2)
        app-brand-button(brand='google' @click='loginWith("google")' large)
          span 使用Google登入
      v-flex(mx-auto my-2)
        app-brand-button(@click='loginWith("facebook")' color="rgb(66,103,178)" class="white--text" large)
          v-icon(left) mdi-facebook-box
          span 使用臉書登入
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
    // TODO: error handling
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
