<template lang='pug'>
v-dialog(v-model='dialog', :max-width='options.width', @keydown.esc='cancel', v-bind:style='{ zIndex: options.zIndex }' persistent )
  v-card
    v-toolbar(v-if='title', dark, :color='options.color', dense, flat)
      v-toolbar-title.white--text {{ title }}
    v-card-text(v-show='!!message') {{ message }}
      v-text-field(
        flat required hide-details
        autofocus=true
        v-model="val"
        :value=val
        :rules="[() => !!val || 'This field is required']")
    v-card-actions.pt-0
      v-spacer
      v-btn(color='grey', flat='flat', @click.native='cancel') {{$t('ui.button_cancel')}}
      v-btn(color='primary darken-1', flat='flat', @click.native='agree') {{$t('ui.button_confirm')}}
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Prompt extends Vue {
  dialog = false
  resolve: ((result?) => void) | null = null
  reject: ((error) => void) | null = null
  message = null
  title = null
  val = null
  options = {
    color: 'primary',
    width: 290,
    zIndex: 200,
  }

  open(message, val, title, options) {
    this.dialog = true
    this.title = title
    this.message = message
    this.val = val
    this.options = Object.assign(this.options, options)
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  agree() {
    if (this.resolve)
      this.resolve(this.val)
    this.dialog = false
  }

  cancel() {
    if (this.resolve)
      this.resolve(false)
    this.dialog = false
  }
}
</script>
