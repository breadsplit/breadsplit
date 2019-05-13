import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Group, Member } from '~/types'

@Component
export default class GroupMixin extends Vue {
  @Getter('group/current') group!: Group
  @Getter('group/activeMembers') members!: Member[]
}
