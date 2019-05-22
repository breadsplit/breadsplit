<template lang='pug'>
app-action-with-text.user-avatar(:class='{inline}')
  template(slot='action')
    v-avatar(:size='size', color='#00000010')
      img(v-if='avatar_url' :src='avatar_url')
      v-icon(v-else) mdi-account
  span(slot='text', v-if='showName') {{getUserName(id)}}
</template>

<script lang='ts'>
import { Mixins, Component, Prop } from 'vue-property-decorator'
import UserInfoMixin from '~/mixins/userinfo'

@Component
export default class Avatar extends Mixins(UserInfoMixin) {
  @Prop(String) readonly id?: string
  @Prop(String) readonly groupId?: string
  @Prop(Boolean) readonly inline?: boolean
  @Prop(Boolean) readonly showName?: boolean
  @Prop({ default: true }) readonly autoFetch!: boolean
  @Prop([Number, String]) readonly size?: number|string

  get user() {
    return this.getUser(this.id, this.autoFetch)
  }

  get avatar_url() {
    if (this.user)
      return this.user.avatar_url
    return ''
  }
}
</script>
