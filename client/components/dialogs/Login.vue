<template lang='pug'>
app-dialog(ref='dialog' :route='true' width='350' :fullscreen='false')
  v-card.login.pa-1
    v-container.mb-2
      v-layout(column)
        v-flex(mx-auto)
          v-card-text {{$t('ui.signin_options.tip')}}
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
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'

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
