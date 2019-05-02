<template lang="pug">
app-action-with-text.app-avatar(:class='{inline}')
  template(slot='action')
    v-avatar(:size='size')
      img(:src='avatarUrl')
  span(slot='text', v-if='showName') {{name}}
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator'
import UserInfoMixin from './mixins/userinfo'

@Component
export default class Avatar extends Mixins(UserInfoMixin) {
  menu = false

  @Prop(Boolean) readonly inline?: boolean
  @Prop(Boolean) readonly showName?: boolean
  @Prop([Number, String]) readonly size?: number|string
}
</script>
