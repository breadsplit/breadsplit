import md5 from 'crypto-js/md5'
import { Vue, Component } from 'vue-property-decorator'
import { Member } from '~/types'
import { Mutation } from 'vuex-class'
import avatarPlaceholder from '~/utils/avatarPlaceholders'

@Component
export default class MemberMixin extends Vue {
  getMemberAvatar(member: Member) {
    if (!member.disableAvatarUrl && member.avatarUrl)
      return member.avatarUrl

    let hash = ''
    if (member.avatarHash) {
      hash = member.avatarHash
    }
    else {
      const email = (member.email || member.id || '').trim().toLowerCase()
      hash = md5(email).toString()
    }
    return avatarPlaceholder(hash)
  }

  @Mutation('group/addMember') newMember
  @Mutation('group/editMember') editMember
  @Mutation('group/removeMember') removeMember
}
