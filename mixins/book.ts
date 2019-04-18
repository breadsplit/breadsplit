export default {
  computed: {
    book() {
      return this.$store.getters['book/current'] || {}
    },
    members() {
      return this.book.members || []
    },
  },
  methods: {

  },
}
