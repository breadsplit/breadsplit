<template lang="pug">
app-action-with-text.app-avatar(:class='{inline}')
  template(slot='action')
    v-avatar( :tile='usePlaceholder')
      img(:src='avatarUrl')
  span(slot='text', v-if='name') {{memberObj.name}}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Member } from '../types'
import { GetMemberAvatarUrl } from '~/utils/avatarProvider'

@Component
export default class extends Vue {
  menu = false

  @Prop(String) readonly id?: string
  @Prop(String) readonly groupId?: string
  @Prop(Object) readonly member?: Member
  @Prop(Boolean) readonly inline?: boolean
  @Prop(Boolean) readonly name?: boolean

  get memberObj(): Member {
    if (this.member)
      return this.member
    return this.$store.getters['group/memberById']({
      groupId: this.groupId,
      memberId: this.id,
    }) || {}
  }

  get avatarUrl() {
    return GetMemberAvatarUrl(this.memberObj)
  }

  get usePlaceholder() {
    return this.memberObj.disableAvatarUrl || !this.avatarUrl
  }
}
</script>
