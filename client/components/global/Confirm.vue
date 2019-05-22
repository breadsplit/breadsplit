<template lang='pug'>
v-dialog(v-model='dialog', :max-width='options.width', @keydown.esc='cancel', v-bind:style='{ zIndex: options.zIndex }')
  v-card
    v-toolbar(v-if='title', dark, :color='options.color', dense, flat)
      v-toolbar-title.white--text {{ title }}
    v-card-text(v-show='!!message') {{ message }}
    v-card-actions.pt-0
      v-spacer
      v-btn(color='grey', flat='flat', @click.native='cancel') {{$t('ui.button_no')}}
      v-btn(color='primary darken-1', flat='flat', @click.native='agree') {{$t('ui.button_yes')}}
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Confirm extends Vue {
  dialog = false
  resolve: ((result?) => void) | null = null
  reject: ((error) => void) | null = null
  message = null
  title = null
  options = {
    color: 'primary',
    width: 290,
    zIndex: 200,
  }

  open(message, title, options) {
    this.dialog = true
    this.title = title
    this.message = message
    this.options = Object.assign(this.options, options)
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  agree() {
    if (this.resolve)
      this.resolve(true)
    this.dialog = false
  }

  cancel() {
    if (this.resolve)
      this.resolve(false)
    this.dialog = false
  }
}
</script>
