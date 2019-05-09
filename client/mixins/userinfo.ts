import { Vue, Component } from 'vue-property-decorator'
import { UserInfo } from '~/types/models'
import { IsThisId } from '~/utils/id_helper'
import { avatarProvider } from '~/utils/avatarProvider'
import nanoid from 'nanoid'

@Component
export default class UserInfoMixin extends Vue {
  getUser(id?: string, autoFetch: boolean = true): UserInfo | null {
    if (!id)
      return null
    if (IsThisId.UID(id)) {
      const user = this.$store.getters['user/user'](id)
      if (!user && autoFetch)
        this.$fire.updateUserProfiles([id])
      return user
    }
    return null
  }

  getAvatarUrl(id: string) {
    const user = this.getUser(id)
    if (user && user.avatar_url)
      return user.avatar_url
    return this.getFallbackAvatar(id)
  }

  getFallbackAvatar(id: string) {
    const dark = this.$store.getters.dark
    return avatarProvider(id || nanoid(), dark)
  }

  getName(id: string) {
    const user = this.getUser(id)
    if (user)
      return user.name
  }
}
