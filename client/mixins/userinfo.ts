import { Vue, Component } from 'vue-property-decorator'
import { UserInfo, Member } from '~/types/models'
import { IsThisId } from '~/utils/id_helper'
import { avatarProvider } from '~/utils/avatarProvider'
import nanoid from 'nanoid'

@Component
export default class UserInfoMixin extends Vue {
  getUser(id?: string, autoFetch: boolean = true): UserInfo | Member | null {
    if (!id)
      return null
    if (IsThisId.UID(id)) {
      const user = this.$store.getters['user/user'](id)
      if (!user && autoFetch)
        this.$fire.updateUserProfiles([id])
      return user
    }
    return this.getMember(id)
  }

  getMember(id: string): Member | null {
    return this.$store.getters['group/memberById']({
      memberId: id,
    })
  }

  getAvatarUrl(id: string) {
    const user = this.getUser(id)
    if (user && 'avatar_url' in user)
      return user.avatar_url
    return this.getFallbackAvatar(id)
  }

  getFallbackAvatar(id: string) {
    const dark = this.$store.getters.dark
    return avatarProvider(id || nanoid(), dark)
  }

  getUserName(id: string) {
    const user = this.getUser(id)
    if (user)
      return user.name
  }
}
