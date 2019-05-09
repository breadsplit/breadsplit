<template lang='pug'>
span(v-if='value') {{value}}
</template>

<script lang='ts'>
import { Mixins, Component, Prop } from 'vue-property-decorator'
import UserInfoMixin from '~/mixins/userinfo'

@Component
export default class UserInfo extends Mixins(UserInfoMixin) {
  @Prop(String) readonly id?: string
  @Prop({ default: 'name' }) readonly field!: string

  get user() {
    return this.getUser(this.id)
  }

  get email() {
    if (this.user)
      return this.user.email
    return ''
  }

  get value() {
    return this[this.field]
  }
}
</script>
