<template lang='pug'>
v-card.form-user.text-center.pa-4
  app-file-upload(@change='onFileChanged' :disabled='!isMe').pt-3
    app-user-avatar(:id='userid' size='96' :loading='uploading')
  br
  .names.mt-2
    app-user-info.name(:id='userid' field='name')
    app-user-info.original-name(:id='userid' field='original_name')
  app-user-info.email.mt-n1(:id='userid' field='email')

  .mt-4

  v-btn(text @click='promptRename' v-if='isMe || isLocaleMember') {{$t('ui.user.change_name')}}
  v-btn(text @click='promptLogout' color='red' v-if='isMe && isGlobal') {{$t('ui.user.logout')}}
</template>

<script lang='ts'>
import { Component, mixins, Action } from 'nuxt-property-decorator'
import { UserInfoMixin, NavigationMixin, DialogChildMixin } from '~/mixins'
import { IsThisId } from '~/core'

@Component
export default class FormUser extends mixins(DialogChildMixin, UserInfoMixin, NavigationMixin) {
  @Action('group/editMember') editMember

  uploading = false

  get userid() {
    return this.options.userid || this.uid
  }

  get isGlobal() {
    return this.options.global
  }

  get isMe() {
    return this.userid === this.uid
  }

  get user() {
    return this.getUser(this.userid)
  }

  get isLocaleMember() {
    return IsThisId.LocalMember(this.userid)
  }

  async promptLogout() {
    if (await this.$confirm(this.$t('prompt.logout_confirm'))) {
      await this.$fire.logout()
      this.gotoHome()
    }
  }

  async promptRename() {
    if (!this.user)
      return

    const name = await this.$prompt(this.$t('tips.user_name_input_placeholder'), this.user.name, { required: true })
    if (name) {
      if (this.isMe) {
        this.$store.commit('user/updateMyProfile', { name })
        this.clearUserCache(this.userid)
        this.$fire.uploadMyProfile()
      }
      else {
        await this.editMember({ memberid: this.userid, changes: { name } })
      }
    }
  }

  async onFileChanged(files: File[]) {
    const file = files[0]
    if (!file)
      return
    this.uploading = true
    try {
      const avatar_url = `${await this.$fire.uploadAvatar(file)}?ts${+new Date()}`
      this.$store.commit('user/updateMyProfile', { avatar_url })
      this.clearUserCache(this.userid)
      this.$fire.uploadMyProfile()
    }
    catch (e) {
      console.error(e)
    }
    this.uploading = false
  }
}
</script>

<style lang="sass">
.form-user
  .names
    display: block

  .name
    font-size: 1.3em

  .name.original
    font-size: 1em
    opacity: 0.6

  .email
    opacity: 0.6
    display: block
</style>
