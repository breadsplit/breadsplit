import { Vue, Component, Prop } from 'vue-property-decorator'
import { Member, UserInfo } from '~/types/models'
import { IsThisId } from '~/utils/id_helper'
import { GetMemberAvatarUrl } from '~/utils/avatarProvider'

@Component
export default class UserInfoMixin extends Vue {
  @Prop(String) readonly id?: string
  @Prop(String) readonly groupId?: string

  get member(): Member {
    return this.$store.getters['group/memberById']({
      groupId: this.groupId,
      memberId: this.id,
    }) || {}
  }

  get user(): UserInfo | null {
    const id = this.id || this.member.id
    if (!id)
      return null
    if (IsThisId.UID(id))
      return this.$store.getters['user/user'](id)
    return null
  }

  get avatarUrl() {
    if (this.user && this.user.avatar_url)
      return this.user.avatar_url
    return GetMemberAvatarUrl(this.member)
  }

  get name() {
    if (this.user)
      return this.user.display_name
    return this.member.name
  }
}
