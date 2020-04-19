<template lang='pug'>
span(v-if='value' :style='style') {{value}}
</template>

<script lang='ts'>
import { mixins, Component, Prop } from 'nuxt-property-decorator'
import UserInfoMixin from '~/mixins/userinfo'
import { UserInfo, Member } from '~/types'

@Component
export default class UserInfoLabel extends mixins(UserInfoMixin) {
  @Prop(String) readonly id?: string
  @Prop({ default: 'name' }) readonly field!: string
  @Prop(Boolean) readonly bold?: boolean
  @Prop(Object) readonly user?: UserInfo
  @Prop(Object) readonly member?: Member

  get userInfo() {
    return this.getUser(this.id, this.member, this.user)
  }

  get value() {
    if (this.userInfo)
      return this.userInfo[this.field]
    return ''
  }

  get style() {
    const style = {}
    if (this.bold)
      style['font-weight'] = 'bold'
    return style
  }
}
</script>
