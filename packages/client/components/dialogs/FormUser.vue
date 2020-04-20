<template lang='pug'>
v-card.form-user.text-center.pa-4
  app-file-upload(@change='onFileChanged' :disabled='!isMe').pt-3
    app-user-avatar(:id='userid' size='96' :loading='uploading')

  .names.mt-3
    v-btn(icon small v-if='isMe || isLocaleMember')
    span.name {{user.name}}
    v-btn(icon small v-if='isMe || isLocaleMember' @click='promptRename' )
      v-icon(small).op-50 mdi-pencil
    // app-user-info.original-name(:id='userid' field='original_name')
  .email.mt-n1 {{user.email || $t('ui.user.local_member_placeholder')}}

  .mt-4

  v-btn(text @click='promptLogout' color='red' v-if='isMe && isGlobal') {{$t('ui.user.logout')}}

  app-promise-dialog(ref='dialog' :max-width='500')
    v-card
      cropper(
        ref='cropper'
        :stencil-component='stencil'
        :src='cropingImage'
      )
      .px-2.py-1.text-right
        v-btn(@click='$refs.dialog.close()' text).op-50 {{$t('ui.button_cancel')}}
        v-btn(@click='crop' text color='primary') {{$t('ui.button_confirm')}}
</template>

<script lang='ts'>
import { Component, mixins, Action } from 'nuxt-property-decorator'
import { UserInfoMixin, NavigationMixin, DialogChildMixin } from '~/mixins'
import CircleStencil from '~/components/images/CircleStencil.vue'
import { IsThisId } from '~/core'

@Component({
  components: {
    CircleStencil,
  },
})
export default class FormUser extends mixins(DialogChildMixin, UserInfoMixin, NavigationMixin) {
  @Action('group/editMember') editMember

  uploading = false
  cropingImage: string | null = null
  stencil = CircleStencil

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

  async crop() {
    // @ts-ignore
    const canvas = this.$refs.cropper.getResult().canvas as HTMLCanvasElement
    const base64 = canvas.toDataURL()
    // @ts-ignore
    this.$refs.dialog.close(base64)
  }

  async onFileChanged(files: File[]) {
    const file = files[0]
    if (!file)
      return

    await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        this.cropingImage = e.target.result
        resolve()
      }
      reader.readAsDataURL(file)
    })

    // @ts-ignore
    const imageBas64 = await this.$refs.dialog.open()
    this.cropingImage = null
    if (!imageBas64)
      return

    this.uploading = true
    try {
      const avatar_url = `${await this.$fire.uploadAvatar(imageBas64)}?ts${+new Date()}`
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

    & > *
      vertical-align: middle

  .name
    font-size: 1.3em

  .name.original
    font-size: 1em
    opacity: 0.6

  .email
    opacity: 0.6
    display: block
</style>
