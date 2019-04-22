import { Vue, Component } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

@Component
export default class MemberMixin extends Vue {
  @Mutation('group/addMember') newMember
  @Mutation('group/editMember') editMember
  @Mutation('group/removeMember') removeMember

  getMemberFromId({ id, groupId }: {id: string; groupId?: string}) {
    return this.$store.getters['group/memberById']({
      groupId,
      memberId: id,
    }) || {}
  }
}
