import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { UserInfo, Member, UserMemberInfo } from '~/types'
import { IsThisId } from '~/core'
import { avatarProvider } from '~/utils/avatar_providers'
import nanoid from 'nanoid'

@Component
export default class UserInfoMixin extends Vue {
  @Getter('user/uid') uid: string | undefined
  @Getter('user/me') me: UserInfo | undefined

  getUser(uid?: string, autoFetch: boolean = true): UserMemberInfo | undefined {
    if (!uid)
      return undefined
    const member = this.getMember(uid)
    let user: UserInfo | undefined
    if (IsThisId.Me(uid) && this.uid) {
      user = this.me
    }
    else if (IsThisId.UID(uid)) {
      user = this.$store.getters['user/user'](uid)
      if (!user && autoFetch)
        this.$fire.updateUserProfiles([uid])
    }
    const result = Object.assign({}, member, user)
    if (!result.avatar_url)
      result.avatar_url = this.getFallbackAvatar(uid)
    return result
  }

  getMember(uid: string): Member | undefined {
    if (IsThisId.Me(uid)) {
      return {
        uid,
        name: this.$t('pronoun.me').toString(),
        role: 'owner',
      }
    }
    return this.$store.getters['group/memberById']({ uid })
  }

  getAvatarUrl(uid: string) {
    const user = this.getUser(uid)
    if (user && 'avatar_url' in user)
      return user.avatar_url
    return this.getFallbackAvatar(uid)
  }

  getFallbackAvatar(uid: string) {
    const dark = this.$store.getters.dark
    return avatarProvider(uid || nanoid(), dark) as string
  }

  getUserName(uid: string, pronoun = true) {
    if (pronoun && (uid === this.uid || IsThisId.Me(uid)))
      return this.$t('pronoun.i').toString()

    const user = this.getUser(uid)
    if (user)
      return user.name
  }
}
