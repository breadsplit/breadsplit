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
  newMember({ bookidx, member }) {
    this.$store.dispatch('book/newMember', { bookidx, member })
  }
  renameMember({ bookidx, memberid, name }) {
    this.$store.dispatch('book/editMember', { bookidx, memberid, changes: { name } })
  }
  removeMember({ bookidx, memberid }) {
    this.$store.dispatch('book/removeMember', { bookidx, memberid })
  }
}
