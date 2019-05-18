<template lang='pug'>
v-card.init-page
  app-dialog-bar(@close='close()')
    | {{$t('ui.welcome_breadsplit')}}

  v-card-text.px-4

    p <b>Thank you so much to try BreadSplit</b>!

    p
      | We are currently in a very <b>early beta</b> stage.
      | Many features are still under developmenting.
      | We will continuesly update and add features in next serval weeks.
      | During this period, you may encounter some bugs or poor experiences,
      | please kindly feedback to us, it's very important for us to make this a better app.

    p Enjoy!

    p.text-xs-right.signature.mb-1 The BreadSplit Team

  v-card-actions.pt-0.pb-3.px-3
    v-spacer
    v-btn(color='primary' flat @click.native='more()') {{$t('ui.button_more_about_us')}}
    v-btn(color='primary darken-1' @click.native='close()') {{$t('ui.button_ok')}}

</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class InitPage extends Vue {
  close(result?) {
    this.$emit('close', result)
  }

  more() {
    // @ts-ignore
    this.$root.$about.open()
  }
}
</script>

<style lang="stylus">
.signature
  font-style italic
  opacity 0.7
  margin-top -1em
</style>
