<template lang='pug'>
v-card.feedback
  app-dialog-bar(@close='close()') {{$t('ui.feedback')}}

  v-container.text-center
    v-text-field(
      :label='$t("feedback.contact_info") + $t("ui.optional")'
      v-model='feedbackInfo.email'
      clearable auto-grow filled)

    v-textarea(
      :label='$t("feedback.describe")'
      v-model='feedbackInfo.content'
      :counter='closeToMaxLength ? maxlength : null'
      autofocus filled clearable
      persistent-hint :hint='issueHint')

    .mt-3

    v-btn(block @click='upload()' :disabled='!hasMeaningfulContent') {{$t('ui.button_send')}}

</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { FeedbackOptions } from '~/types'
import { DialogChildMixin } from '~/mixins'
import socials from '~/../meta/socials'

@Component
export default class FeedBack extends mixins(DialogChildMixin) {
  socials = socials
  maxlength = 2000

  feedbackInfo: FeedbackOptions = {
    email: this.$store.getters['user/me'].email || '',
    content: '',
  }

  get issueHint () {
    return this.$t('feedback.github_hint', [`<a href="${socials.github} target="_blank">Github</a>`])
  }

  get hasMeaningfulContent () {
    const content = this.feedbackInfo.content || ''
    return content.trim().length > 5 && content.length <= this.maxlength
  }

  get closeToMaxLength () {
    const content = this.feedbackInfo.content || ''
    return content.length / this.maxlength >= 0.9
  }

  async upload () {
    this.$apploading.open(this.$t('prompt.sending').toString())
    await this.$fire.sendFeedback(this.feedbackInfo)
    this.$apploading.close()
    this.$snack(this.$t('prompt.feedback_delivered'), { color: 'success', timeout: 3000 })
    this.close()
  }

  get online () {
    return this.$store.getters['user/online']
  }
}
</script>
