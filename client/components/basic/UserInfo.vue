<template lang='pug'>
span(v-if='value') {{value}}
</template>

<script lang='ts'>
import { mixins, Component, Prop } from 'nuxt-property-decorator'
import UserInfoMixin from '~/mixins/userinfo'

@Component
export default class UserInfo extends mixins(UserInfoMixin) {
  @Prop(String) readonly id?: string
  @Prop({ default: 'name' }) readonly field!: string

  get user() {
    return this.getUser(this.id)
  }

  get value() {
    if (this.user)
      return this.user[this.field]
    return ''
  }
}
</script>
