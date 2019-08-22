<template lang='pug'>
.action-with-text.user-avatar(:class='{inline}')
  .action
    v-avatar(:size='size', color='#00000010')
      slot
        img(v-if='avatar_url' :src='avatar_url')
        v-icon(v-else) mdi-account
  span.text(v-if='showName')
    slot(name='text') {{name}}
</template>

<script lang='ts'>
import { mixins, Component, Prop } from 'nuxt-property-decorator'
import UserInfoMixin from '~/mixins/userinfo'

@Component
export default class UserAvatar extends mixins(UserInfoMixin) {
  @Prop(String) readonly id?: string
  @Prop(Boolean) readonly inline?: boolean
  @Prop(Boolean) readonly showName?: boolean
  @Prop({ default: true }) readonly autoFetch!: boolean
  @Prop([Number, String]) readonly size?: number|string

  get _user () {
    return this.getUser(this.id)
  }

  get avatar_url () {
    if (this._user)
      return this._user.avatar_url
    return ''
  }

  get name () {
    if (this._user)
      return this._user.name
    return ''
  }
}
</script>
