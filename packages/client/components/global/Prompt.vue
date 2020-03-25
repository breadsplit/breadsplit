<template lang='pug'>
app-promise-dialog(ref='dialog' :max-width='options.width')
  v-card.pa-2
    .px-4.pt-6.pb-2
      template(v-if='options.textarea')
        v-textarea(
            v-model='value'
            :label='title'
            autofocus
            outlined
            required
            hide-details
        )
      template(v-else)
        v-text-field(
            v-model='value'
            :label='title'
            autofocus
            outlined
            required
            hide-details
        )
    v-card-actions
      v-spacer
      .pa-1
        v-btn(color='grey' text @click='cancel()') {{$t('ui.button_cancel')}}
        v-btn(color='primary' text @click='agree()' :disabled='options.required && !value').px-4 {{$t('ui.button_confirm')}}
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
import PromiseDialog from './PromiseDialog.vue'

const DEFAULT_OPTIONS = {
  color: 'primary',
  width: 350,
  textarea: false,
  required: false,
}

@Component
export default class Prompt extends Vue {
  dialog = false

  title = null
  value = null
  originalValue = null

  options = {
    color: 'primary',
    width: 290,
    textarea: false,
    required: false,
  }

  $refs!: {
    dialog: PromiseDialog
  }

  async open(title, value, options) {
    this.dialog = true
    this.title = title
    this.value = value
    this.originalValue = value
    this.options = Object.assign(this.options, DEFAULT_OPTIONS, options)

    return await this.$refs.dialog.open(value)
  }

  agree() {
    this.$refs.dialog.close(this.value)
  }

  cancel() {
    this.$refs.dialog.close(this.originalValue)
  }
}
</script>
