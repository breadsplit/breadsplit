<template lang='pug'>
span(v-if='value' :style='style') {{value}}
</template>

<script lang='ts'>
import { mixins, Component, Prop } from 'nuxt-property-decorator'
import UserInfoMixin from '~/mixins/userinfo'
import { Member, UserInfo } from '~/types'

@Component
export default class UserInfoLabel extends mixins(UserInfoMixin) {
  @Prop(String) readonly id?: string
  @Prop({ default: 'name' }) readonly field!: string
  @Prop(Object) readonly user?: UserInfo
  @Prop(Object) readonly member?: Member
  @Prop(Boolean) readonly bold?: boolean

  get _user() {
    return this.getUser(this.id, this.member, this.user)
  }

  get value() {
    if (this._user)
      return this._user[this.field]
    return ''
  }

  get style() {
    const style = {}
    if (this.bold != null)
      style['font-weight'] = 'bold'
    return style
  }
}
</script>
