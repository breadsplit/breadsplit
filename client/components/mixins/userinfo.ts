import { Vue, Component, Prop } from 'vue-property-decorator'
import { Member, UserInfo } from '~/types/models'
import { IsThisId } from '~/utils/id_helper'
import { GetMemberAvatarUrl, avatarProvider } from '~/utils/avatarProvider'
import nanoid from 'nanoid'

@Component
export default class UserInfoMixin extends Vue {
  @Prop(String) readonly id?: string
  @Prop(String) readonly groupId?: string

  get member(): Member|null {
    return this.$store.getters['group/memberById']({
      groupId: this.groupId,
      memberId: this.id,
    }) || null
  }

  get user(): UserInfo|null {
    const id = this.id || (this.member && this.member.id)
    if (!id)
      return null
    if (IsThisId.UID(id))
      return this.$store.state.user.users[id]
    return null
  }

  fetchUserProfile(uid: string) {
    if (IsThisId.UID(uid) && !this.$store.getters['user/user'](uid))
      this.$fire.updateUserProfiles([uid])
  }

  get avatarUrl() {
    if (this.user && this.user.avatar_url)
      return this.user.avatar_url
    const dark = this.$store.getters.dark
    if (this.member)
      return GetMemberAvatarUrl(this.member, dark)
    return avatarProvider(this.id || nanoid(), dark)
  }

  get fallbackAvatar() {
    const dark = this.$store.getters.dark
    return avatarProvider(this.id || nanoid(), dark)
  }

  get name() {
    if (this.user)
      return this.user.name
    return (this.member && this.member.name) || ''
  }
}
