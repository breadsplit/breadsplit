<template lang='pug'>
v-dialog(v-model='dialog', :max-width='options.width', @keydown.esc='cancel', v-bind:style='{ zIndex: options.zIndex }')
  v-card
    v-toolbar(v-if='title', dark, :color='options.color', dense, flat)
      v-toolbar-title.white--text {{ title }}
    v-card-text(v-show='!!message') {{ message }}
    v-card-actions.pt-0
      v-spacer
      v-btn(color='primary darken-1', flat='flat', @click.native='agree') Yes
      v-btn(color='grey', flat='flat', @click.native='cancel') Cancel
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: 'primary',
      width: 290,
      zIndex: 200,
    },
  }),
  methods: {
    open(message, title, options) {
      this.dialog = true
      this.title = title
      this.message = message
      this.options = Object.assign(this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree() {
      this.resolve(true)
      this.dialog = false
    },
    cancel() {
      this.resolve(false)
      this.dialog = false
    },
  },
}
</script>
