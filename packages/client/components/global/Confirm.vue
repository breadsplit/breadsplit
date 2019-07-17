<template lang='pug'>
app-promise-dialog(ref='dialog' :max-width='options.width')
  v-toolbar(dark :color='options.color' dense)
    v-toolbar-title.white--text {{ title }}
  v-card(tile)
    v-card-text(v-show='!!message') {{ message }}
    v-card-actions
      v-spacer
      v-btn(color='grey' text @click='cancel()') 取消
      v-btn(color='primary darken-1' text @click='agree()') 确定
</template>

<script lang='ts'>
import { Vue, Component } from 'nuxt-property-decorator'
import PromiseDialog from './PromiseDialog.vue'

@Component
export default class Confirm extends Vue {
  message = ''
  title = ''

  options = {
    color: 'primary',
    width: 350,
  }

  $refs!: {
    dialog: PromiseDialog
  }

  async open (title, message = '', options = {}) {
    this.title = title
    this.message = message
    this.options = Object.assign(this.options, options)

    return await this.$refs.dialog.open(false)
  }

  agree () {
    this.$refs.dialog.close(true)
  }

  cancel () {
    this.$refs.dialog.close(false)
  }
}
</script>
