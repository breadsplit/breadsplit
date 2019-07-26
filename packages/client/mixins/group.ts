import { Vue, Component, Getter } from 'nuxt-property-decorator'
import { Group, Member } from '~/types'
import { GroupCurrency, ParserCategory } from '~/core'

@Component
export default class GroupMixin extends Vue {
  @Getter('group/current') group!: Group
  @Getter('group/activeMembers') members!: Member[]

  get currencies () {
    return GroupCurrency(this.group)
  }

  parseCategory (category: string = 'other') {
    return ParserCategory(category, this.group, this)
  }
}
