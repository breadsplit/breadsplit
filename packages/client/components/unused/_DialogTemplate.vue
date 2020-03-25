<template lang='pug'>
v-card
  app-dialog-bar(@close='close()')
    | Hello

  v-card-text
    p World

  v-card-actions
    v-spacer
    v-btn(color='primary darken-1' @click='close()') {{$t('ui.button_ok')}}

</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class TEMPLATE extends Vue {
  close(result?) {
    this.$emit('close', result)
  }
}
</script>
