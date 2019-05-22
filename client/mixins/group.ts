import { Vue, Component, Getter } from 'nuxt-property-decorator'
import { Group, Member } from '~/types'

@Component
export default class GroupMixin extends Vue {
  @Getter('group/current') group!: Group
  @Getter('group/activeMembers') members!: Member[]
}
