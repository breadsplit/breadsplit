import md5 from 'crypto-js/md5'
import { Vue, Component } from 'vue-property-decorator'
import { Member } from '~/types'
import { Mutation } from 'vuex-class'

@Component
export default class MemberMixin extends Vue {
  getMemberAvatar(member: Member) {
    if (member.avatar)
      return member.avatar
    const email = (member.email || member.id || '').trim().toLowerCase()
    const hash = md5(email).toString()
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`
  }

  @Mutation('group/addMember') newMember
  @Mutation('group/editMember') editMember
  @Mutation('group/removeMember') removeMember
}
