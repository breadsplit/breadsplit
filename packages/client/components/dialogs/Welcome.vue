<template lang='pug'>
v-card.welcome-dialog
  app-dialog-bar(@close='close()')
    | {{$t('prompt.welcome.title')}}

  v-card-text.px-4

    p(v-html='$t("prompt.welcome.para1")')

    p(v-html='$t("prompt.welcome.para2")')

    p(v-html='$t("prompt.welcome.para3")')

    p.text-right.signature.mb-1 {{$t('prompt.welcome.sign')}}

  v-card-actions.pt-0.pb-3.px-3
    v-spacer
    v-btn(color='primary' text @click.native='openDialog("about")') {{$t('ui.button_more_about_us')}}
    v-btn(color='primary darken-1' @click.native='close()') {{$t('ui.button_ok')}}

</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { DialogChildMixin, NavigationMixin } from '~/mixins'

@Component
export default class WelcomeDialog extends mixins(DialogChildMixin, NavigationMixin) {
}
</script>

<style lang='sass'>
.welcome-dialog
  .signature
    font-style: italic
    opacity: 0.7
    margin-top: -1em
</style>
