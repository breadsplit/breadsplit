<template lang='pug'>
span(v-if='value' :style='style') {{value}}
</template>

<script lang='ts'>
import { mixins, Component, Prop } from 'nuxt-property-decorator'
import UserInfoMixin from '~/mixins/userinfo'

@Component
export default class UserInfoLabel extends mixins(UserInfoMixin) {
  @Prop(String) readonly id?: string
  @Prop({ default: 'name' }) readonly field!: string
  @Prop(Boolean) readonly bold?: boolean

  get _user () {
    return this.getUser(this.id)
  }

  get value () {
    if (this._user)
      return this._user[this.field]
    return ''
  }

  get style () {
    const style = {}
    if (this.bold)
      style['font-weight'] = 'bold'
    return style
  }
}
</script>
