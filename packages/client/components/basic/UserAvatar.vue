<template lang='pug'>
.action-with-text.user-avatar(:class='{inline}')
  .action
    v-avatar(:size='size', color='#00000010')
      slot
        img(v-if='avatar_url' :src='avatar_url')
        v-icon(v-else) mdi-account
        .loader(v-if='loading')
          v-progress-circular(
            indeterminate
            color='white'
            :width='loaderWidth'
            :size='loaderSize'
          )
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
  @Prop({ default: false }) readonly loading!: boolean

  get userInfo() {
    return this.getUser(this.id, this.member, this.user)
  }

  get avatar_url() {
    if (this.userInfo)
      return this.userInfo.avatar_url
    return ''
  }

  get loaderSize() {
    return +(this.size || 12) * 0.8
  }

  get loaderWidth() {
    return +(this.size || 12) / 24
  }

  get name() {
    if (this.userInfo)
      return this.userInfo.name
    return ''
  }
}
</script>

<style lang="sass">
.user-avatar
  .loader
    position: absolute
    top: 0
    bottom: 0
    right: 0
    left: 0
    background: rgba(0,0,0,0.3)
    display: grid

    .v-progress-circular
      margin: auto
</style>
