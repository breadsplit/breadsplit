import { Vue, Component } from 'vue-property-decorator'

@Component
export default class BookMixin extends Vue {
  get book() {
    return this.$store.getters['book/current'] || {}
  }
  get members() {
    return this.book.members || []
  }
}
