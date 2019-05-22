<template lang='pug'>
v-card.feedback
  app-dialog-bar(@close='close()')
    | 意見回饋
  v-container.text-xs-center
    v-rating(v-model='starrate' hover light background-color="grey darken-1" v-if='online')

    v-text-field(name="femail" label='Email' clearable='true' height='10' v-model='feedbackInfo.email' auto-grow box)

    v-textarea(name="fissue" label='Describe your issue or idea.' auto-grow='true' autofocus='true' box='true' clearable='true' v-model='feedbackInfo.content' persistent-hint :hint='issueHint')

    v-btn(block depressed flat @click='upload()' :loading='submitFlag' v-if='finish') Submit
    v-btn(block depressed flat disabled v-if='!finish') 提交完畢

</template>

<script lang='ts'>
import { setTimeout } from 'timers'
import { Component, mixins } from 'nuxt-property-decorator'
import { FeedbackOptions } from '~/types'
import { DialogChildMixin } from '~/mixins'

@Component
export default class FeedBack extends mixins(DialogChildMixin) {
  issueHint = 'Or you can create an issue on our <a href="https://github.com/breadsplit/breadsplit" target="_blank">github</a> '
  submitFlag = false
  finish = true
  starrate = this.$store.getters['user/me'].starrate === undefined ? '0' : this.$store.getters['user/me'].starrate
  feedbackInfo: FeedbackOptions = {
    email: this.$store.getters['user/me'].email ? this.$store.getters['user/me'].email : '',
    content: '',
  }
  close(result?) {
    this.$emit('close', result)
  }

  upload() {
    this.$fire.sendFeedback(this.feedbackInfo)
    this.$store.commit('setStarRate', this.starrate)
    this.submitFlag = true
    setTimeout(() => {
      this.submitFlag = false
      this.finish = false
      setTimeout(() => {
        this.close()
      }, 700)
    }, 1500)
  }

  get online() {
    return this.$store.getters['user/online']
  }
}
</script>
