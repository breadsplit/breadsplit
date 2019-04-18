import md5 from 'crypto-js/md5'
import { Vue, Component } from 'vue-property-decorator'
import { Member } from '~/types'

@Component
export default class MemberMixin extends Vue {
  getMemberAvatar(member: Member) {
    if (member.avatar)
      return member.avatar
    const email = (member.email || member.id || '').trim().toLowerCase()
    const hash = md5(email).toString()
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`
  }
  newMember({ id, member }) {
    this.$store.commit('book/newMember', { id, member })
  }
  renameMember({ id, memberid, name }) {
    this.$store.commit('book/editMember', { id, memberid, changes: { name } })
  }
  removeMember({ id, memberid }) {
    this.$store.commit('book/removeMember', { id, memberid })
  }
}
