import { Vue, Component } from 'vue-property-decorator'
import { Action } from 'vuex-class'

@Component
export default class MemberMixin extends Vue {
  @Action('group/addMember') newMember
  @Action('group/editMember') editMember
  @Action('group/removeMember') removeMember

  getMemberFromId({ id, groupId }: {id: string; groupId?: string}) {
    return this.$store.getters['group/memberById']({
      groupId,
      uid: id,
    }) || {}
  }
}
