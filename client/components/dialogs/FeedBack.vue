<template lang='pug'>
v-card.feedback
  app-dialog-bar(@close='close()')
    | 意見回饋
  v-container.text-xs-center
    v-text-field(name="femail" label='Email' clearable='true' height='10' v-model='feedbackInfo.email' auto-grow box)
    v-textarea(name="fissue" label='Describe your issue or idea... ...' auto-grow='true' autofocus='true' box='true' clearable='true' v-model='feedbackInfo.content')

    v-btn(block depressed flat @click='send()' :loading='submitFlag') Submit

</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { FeedbackOptions } from '../../types'

@Component
export default class FeedBack extends Vue {
  feedbackInfo: FeedbackOptions = {
    email: this.$store.getters['user/me'].email ? this.$store.getters['user/me'].email : '',
    content: '',
  }
  submitFlag = false
  close(result?) {
    this.$emit('close', result)
  }

  send() {
    this.$fire.sendFeedback(this.feedbackInfo)
  }
}
</script>
