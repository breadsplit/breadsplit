<template lang='pug'>
app-dialog.login-dialog(ref='dialog' :route='true' width='350' :fullscreen='false')
  v-card.login.pa-1
    v-container.mb-2
      v-layout(column)
        v-flex(mx-auto)
          v-card-text {{$t('ui.signin_options.tip')}}

        v-flex
          .pt-3.pb-1.text-xs-center.privacy-continue
            i18n(path='ui.continue_and_accept')
              a(@click='$refs.privacy.open()') {{$t('ui.privacy_policy')}}
        v-flex(mx-auto my-1)
          app-brand-button(brand='google' @click='loginWith("google")' large width='250px')
            | {{$t('ui.signin_options.Google')}}
        v-flex(mx-auto my-1)
          app-brand-button(brand='facebook' @click='loginWith("facebook")' large width='250px')
            | {{$t('ui.signin_options.Facebook')}}
        v-flex(mx-auto my-1)
          app-brand-button(brand='github_dark' @click='loginWith("github")' large width='250px')
            | {{$t('ui.signin_options.Github')}}
        v-flex(mx-auto my-1).mx-4.mt-2
          app-help-link(help='no_password_login')

  app-dialog(ref='privacy' :route='true')
    app-privacy
</template>

<script lang='ts'>
import { Component, Watch, Vue } from 'nuxt-property-decorator'

@Component
export default class Login extends Vue {
  resolve: ((result) => void) | null = null
  reject: ((error) => void) | null = null

  async loginWith(provider: 'google'|'facebook'|'github') {
    try {
      await this.$fire.loginWith(provider)
      this.close(true)
    }
    catch (e) {
      // TODO: show user feedback
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  get uid() {
    return this.$store.getters['user/uid']
  }

  @Watch('uid')
  onUidChanged(uid) {
    // close dialog on user signed in
    if (uid)
      this.close(true)
  }

  open(options = {}) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      // @ts-ignore
      this.$refs.dialog.open().then(() => this.close(false))
    })
  }

  login(options = {}) {
    return this.open(options)
  }

  close(result: boolean) {
    if (this.resolve)
      this.resolve(true)
    this.resolve = null
    // @ts-ignore
    this.$refs.dialog.close()
  }
}
</script>

<style lang='stylus'>
.login
  .privacy-continue
    font-size 0.95em
    opacity 0.8
</style>
