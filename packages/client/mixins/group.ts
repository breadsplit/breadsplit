import { Vue, Component, Getter } from 'nuxt-property-decorator'
import { Group, Member } from '~/types'
import { GroupCurrency } from '~/core'

@Component
export default class GroupMixin extends Vue {
  @Getter('group/current') group!: Group
  @Getter('group/activeMembers') members!: Member[]

  get currencies () {
    return GroupCurrency(this.group)
  }
}
