import { Vue, Component, Getter } from 'nuxt-property-decorator'
import { Group, Member, ClientGroup } from '~/types'
import { GroupCurrency, ParserCategory, GetCategoriesOfGroup } from '~/core'

function origin () {
  return window.location.origin
}

@Component
export default class GroupMixin extends Vue {
  @Getter('group/current') group!: Group
  @Getter('group/currentClientGroup') clientGroup!: ClientGroup
  @Getter('group/activeMembers') members!: Member[]

  get isOnline () {
    return this.group.online
  }

  get currencies () {
    return GroupCurrency(this.group)
  }

  get sharedOptions () {
    return this.clientGroup.options
  }

  get localOptions () {
    return this.clientGroup.local_options || {}
  }

  get displayCurrency () {
    return this.localOptions.display_currency || this.group.main_currency
  }

  set displayCurrency (currency: string) {
    this.$store.commit('group/setConfig', { id: this.group.id, field: 'display_currency', value: currency })
  }

  get inviteLink () {
    if (this.group && this.group.online)
      return `${origin()}/join?id=${this.group.id}`
    return undefined
  }

  parseCategory (category: string = 'other') {
    return ParserCategory(category, this.group, this)
  }

  get categories () {
    return GetCategoriesOfGroup(this.group, this)
  }
}
