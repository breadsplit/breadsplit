import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Group } from '~/types'

@Component
export default class GroupMixin extends Vue {
  @Getter('group/current') group!: Group

  get members() {
    if (this.group)
      return this.group.members || []
    return []
  }
}
