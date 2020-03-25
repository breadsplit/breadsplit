<template lang='pug'>
.action-with-text.user-avatar(:class='{inline}')
  .action
    v-avatar(:size='size', color='#00000010')
      slot
        img(v-if='avatar_url' :src='avatar_url')
        v-icon(v-else) mdi-account
  .text(v-if='showName')
    slot(name='text') {{name}}
</template>

<script lang='ts'>
import { mixins, Component, Prop } from 'nuxt-property-decorator'
import UserInfoMixin from '~/mixins/userinfo'
import { Member, UserInfo } from '~/types'

@Component
export default class UserAvatar extends mixins(UserInfoMixin) {
  @Prop(String) readonly id?: string
  @Prop(Boolean) readonly inline?: boolean
  @Prop(Boolean) readonly showName?: boolean
  @Prop({ default: true }) readonly autoFetch!: boolean
  @Prop([Number, String]) readonly size?: number|string
  @Prop(Object) readonly user?: UserInfo
  @Prop(Object) readonly member?: Member

  get _user() {
    return this.getUser(this.id, this.member, this.user)
  }

  get avatar_url() {
    if (this._user)
      return this._user.avatar_url
    return ''
  }

  get name() {
    if (this._user)
      return this._user.name
    return ''
  }
}
</script>

<style lang="sass">
.user-avatar
  .text
    // max-width: 60px
    // white-space: nowrap
    // text-overflow: ellipsis
    // overflow: hidden
</style>
