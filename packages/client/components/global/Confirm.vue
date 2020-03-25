<template lang='pug'>
app-promise-dialog(ref='dialog' :max-width='options.width')
  v-toolbar(dark :color='options.color')
    v-toolbar-title.white--text {{ title }}
  v-card(tile)
    v-card-text(v-show='!!message' style='font-size:1em') {{ message }}
    v-card-actions
      v-spacer
      .pa-1
        v-btn(color='grey' text @click='cancel()' v-if='options.cancelable') {{$t('ui.button_cancel')}}
        v-btn(color='primary' text @click='agree()').px-4 {{$t('ui.button_confirm')}}
</template>

<script lang='ts'>
import { Vue, Component } from 'nuxt-property-decorator'
import PromiseDialog from './PromiseDialog.vue'

const DEFAULT_OPTIONS = {
  color: 'primary',
  width: 350,
  cancelable: true,
}

@Component
export default class Confirm extends Vue {
  message = ''
  title = ''

  options = {
    color: 'primary',
    width: 350,
    cancelable: true,
  }

  $refs!: {
    dialog: PromiseDialog
  }

  async open(title: string, message = '', options = {}) {
    this.title = title
    this.message = message
    this.options = Object.assign(this.options, DEFAULT_OPTIONS, options)

    return await this.$refs.dialog.open(false)
  }

  agree() {
    this.$refs.dialog.close(true)
  }

  cancel() {
    this.$refs.dialog.close(false)
  }
}
</script>
