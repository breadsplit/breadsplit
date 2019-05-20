import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { UserInfo, Member } from '~/types'
import { IsThisId } from '~/core'
import { avatarProvider } from '~/utils/avatar_providers'
import nanoid from 'nanoid'

@Component
export default class UserInfoMixin extends Vue {
  @Getter('user/uid') uid: string | undefined
  @Getter('user/me') me: UserInfo | undefined

  getUser(id?: string, autoFetch: boolean = true): (UserInfo & Member) | undefined {
    if (!id)
      return undefined
    const member = this.getMember(id)
    let user: UserInfo | undefined
    if (IsThisId.Me(id) && this.uid) {
      user = this.me
    }
    else if (IsThisId.UID(id)) {
      user = this.$store.getters['user/user'](id)
      if (!user && autoFetch)
        this.$fire.updateUserProfiles([id])
    }
    const result = Object.assign({}, member, user)
    if (!result.avatar_url)
      result.avatar_url = this.getFallbackAvatar(id)
    return result
  }

  getMember(id: string): Member | undefined {
    if (IsThisId.Me(id)) {
      return {
        id,
        name: this.$t('pronoun.me').toString(),
        role: 'owner',
      }
    }
    return this.$store.getters['group/memberById']({
      uid: id,
    })
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
