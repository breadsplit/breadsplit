import { Vue, Component, Getter } from 'nuxt-property-decorator'
import { Group, Member, ClientGroup } from '~/types'
import { GroupCurrency, ParserCategory, GetCategoriesOfGroup } from '~/core'

function origin () {
  return window.location.origin
}

@Component
export default class GroupMixin extends Vue {
  @Getter('group/current') group!: Group
  @Getter('group/currentClientGroup') clientGroup?: ClientGroup
  @Getter('group/activeMembers') members!: Member[]

  get isOnline () {
    if (!this.group)
      return false
    return this.group.online
  }

  get currencies () {
    if (!this.group)
      return []
    return GroupCurrency(this.group)
  }

  get sharedOptions () {
    if (!this.clientGroup)
      return {}
    return this.clientGroup.options || {}
  }

  get localOptions () {
    if (!this.clientGroup)
      return {}
    return this.clientGroup.local_options || {}
  }

  get displayCurrency () {
    if (!this.group)
      return this.$i18n.locale
    return this.localOptions.display_currency || this.group.main_currency
  }

  set displayCurrency (currency: string) {
    if (this.group)
      this.$store.dispatch('group/setConfigs', { id: this.group.id, field: 'display_currency', value: currency })
  }

  get inviteLink () {
    if (this.group && this.group.online)
      return `${origin()}/join?id=${this.group.id}`
    return undefined
  }

  parseCategory (category = 'other') {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return ParserCategory(category, this.group!, this)
  }

  get categories () {
    if (!this.group)
      return []
    return GetCategoriesOfGroup(this.group, this)
  }
}
