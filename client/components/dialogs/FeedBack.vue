<template lang='pug'>
v-card.feedback
  app-dialog-bar(@close='close()')
    | 意見回饋
  v-container.text-xs-center
    v-form(ref='form', v-model='valid',lazy-validation)
    v-textfield()
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class FeedBack extends Vue {
  close(result?) {
    this.$emit('close', result)
  }
}
</script>
