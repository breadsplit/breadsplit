<template lang='pug'>
app-action-with-text.user-avatar(:class='{inline}')
  template(slot='action')
    v-avatar(:size='size', color='#00000010')
      slot
        img(v-if='avatar_url' :src='avatar_url')
        v-icon(v-else) mdi-account
  span(slot='text', v-if='showName')
    slot(name='text') {{getUserName(id)}}
</template>

<script lang='ts'>
import { mixins, Component, Prop } from 'nuxt-property-decorator'
import UserInfoMixin from '~/mixins/userinfo'
import { UserInfo, Member } from '~/types'

@Component
export default class Avatar extends mixins(UserInfoMixin) {
  @Prop(String) readonly id?: string
  @Prop(String) readonly groupId?: string
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
}
</script>
