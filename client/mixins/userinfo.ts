import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { UserInfo, Member } from '~/types'
import { IsThisId } from '~/core'
import { avatarProvider } from '~/utils/avatar_providers'
import nanoid from 'nanoid'

@Component
export default class UserInfoMixin extends Vue {
  @Getter('user/uid') uid: string|undefined

  getUser(id?: string, autoFetch: boolean = true): UserInfo | Member | undefined {
    if (!id)
      return undefined
    if (IsThisId.Me(id)) {
      if (this.$store.getters['user/uid'])
        return this.$store.getters['user/me']
      return {
        id,
        name: this.$t('pronoun.me').toString(),
        role: 'owner',
      }
    }
    if (IsThisId.UID(id)) {
      const user = this.$store.getters['user/user'](id)
      if (!user && autoFetch)
        this.$fire.updateUserProfiles([id])
      return user
    }
    return this.getMember(id)
  }

  getMember(id: string): Member | undefined {
    return this.$store.getters['group/memberById']({
      uid: id,
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

  getUserName(id: string, pronoun = true) {
    if (pronoun && (id === this.uid || IsThisId.Me(id)))
      return this.$t('pronoun.i').toString()

    const user = this.getUser(id)
    if (user)
      return user.name
  }
}
