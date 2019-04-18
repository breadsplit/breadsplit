import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Book } from '~/types'

@Component
export default class BookMixin extends Vue {
  @Getter('book/current') book!: Book

  get members() {
    if (this.book)
      return this.book.members || []
    return []
  }
}
