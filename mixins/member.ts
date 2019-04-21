import { Vue, Component } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import { GetMemberAvatarUrl } from '~/utils/avatarProvider'

@Component
export default class MemberMixin extends Vue {
  getMemberAvatar = GetMemberAvatarUrl

  @Mutation('group/addMember') newMember
  @Mutation('group/editMember') editMember
  @Mutation('group/removeMember') removeMember
}
