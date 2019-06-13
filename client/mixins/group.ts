import { Vue, Component, Getter } from 'nuxt-property-decorator'
import { Group, Member } from '~/types'

@Component
export default class GroupMixin extends Vue {
  @Getter('group/current') group!: Group
  @Getter('group/activeMembers') members!: Member[]

  get currencies() {
    const set = new Set([this.group.currencies[0]])
    for (const trans of this.group.transactions)
      set.add(trans.currency)
    return Array.from(set)
  }
}
