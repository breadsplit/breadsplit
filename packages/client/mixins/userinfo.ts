import { Vue, Component, Getter } from 'nuxt-property-decorator'
import nanoid from 'nanoid'
import { UserInfo, Member, UserMemberInfo } from '~/types'
import { IsThisId, IdMe } from '~/core'
import { LetterAvatar } from '~/utils'

const userCache: Record<string, Record<string, UserMemberInfo>> = {}

@Component
export default class UserInfoMixin extends Vue {
  @Getter('user/uid') uid: string | undefined
  @Getter('user/me') me: UserInfo | undefined

  private setUserCache(uid: string, value: UserMemberInfo) {
    let group = userCache[this.groupId]
    if (!group)
      group = userCache[this.groupId] = {}
    group[uid] = value
  }

  clearUserCache(uid: string) {
    const group = userCache[this.groupId]
    if (group)
      delete group[uid]
  }

  private getUserCache(uid: string) {
    const group = userCache[this.groupId]
    if (!group)
      return undefined
    return group[uid]
  }

  getUser(uid?: string, member?: Member, user?: UserInfo, autoFetch = true): UserMemberInfo | undefined {
    // HACK to tell vue to watch on these variables
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    let _: any
    _ = this.me
    _ = this.$store.getters['user/user'](uid)

    uid = uid || (member && member.uid) || (user && user.uid) || undefined
    if (!uid)
      return undefined

    const cache = this.getUserCache(uid)
    if (cache)
      return cache

    if (!member)
      member = this.getMember(uid)

    if (!user) {
      if (IsThisId.Me(uid) && this.uid) {
        user = this.me
      }
      else if (IsThisId.UID(uid)) {
        user = this.$store.getters['user/user'](uid)
        if (!user && autoFetch) {
          this.$fire.updateUserProfiles([uid])
            .then(() => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.clearUserCache(uid!)
            })
        }
      }
    }

    const result = this.mergeMemberAndUser(member, user)

    if (user)
      this.setUserCache(uid, result)

    return result
  }

  mergeMemberAndUser(member?: Member, user?: UserInfo) {
    const result = Object.assign({}, member, user) as UserMemberInfo

    // when "member" has a name, override as nickname
    if (member
      && member.name
      && result.name !== member.name
    ) {
      result.original_name = result.name
      result.name = member.name
    }

    if (!result.name && result.uid === IdMe)
      result.name = this.$t('pronoun.me').toString()

    // set avatar url
    if (!result.avatar_url && result.uid)
      result.avatar_url = this.getFallbackAvatar(result.uid, result.name)

    return result
  }

  get groupId(): string {
    return this.$store.getters['group/id']
  }

  getMember(uid: string): Member | undefined {
    return this.$store.getters['group/memberById']({ uid })
  }

  getAvatarUrl(uid: string, name: string) {
    const user = this.getUser(uid)
    if (user && 'avatar_url' in user)
      return user.avatar_url
    return this.getFallbackAvatar(uid, name)
  }

  getFallbackAvatar(uid: string, name: string) {
    return LetterAvatar(name || '?', uid || nanoid())
  }

  getUserName(uid: string, pronoun = true) {
    if (pronoun && (uid === this.uid || IsThisId.Me(uid)))
      return this.$t('pronoun.i').toString()

    const user = this.getUser(uid)
    if (user)
      return user.name
  }
}
