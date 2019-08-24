import { Vue, Component } from 'nuxt-property-decorator'
import { hash } from '~/utils/reactive_hash'

@Component
export default class NavigationMixin extends Vue {
  get navGroupId () {
    return this.$store.getters['group/currentId']
  }

  hash = hash.value as any

  updateHash (field: string, value: any) {
    hash.$set(hash.value, field, value)
  }

  gotoHome () {
    this.$router.push('/')
  }

  gotoGroup (id?: string) {
    this.$router.push(`/group/${id || this.navGroupId}`)
  }

  gotoNewTransaction (options: Record<string, any> = { type: 'expense' }) {
    this.openDialog('trans', options)
  }

  gotoTransaction (transid: string, groupid?: string) {
    this.openDialog('trans', { transid, groupid })
  }

  gotoNewGroup (options: Record<string, any> = {}) {
    this.openDialog('group', options)
  }

  gotoNewCategory (options: Record<string, any> = {}) {
    this.openDialog('category', options)
  }

  gotoCategories (options: Record<string, any> = {}) {
    this.openDialog('categories', options)
  }

  openDialog (name: string, options?: object) {
    this.$router.push({
      query: Object.assign({}, options, { dialog: name }),
      hash: this.$route.hash,
    })
  }

  closeDialog () {
    this.$router.replace({ query: {}, hash: this.$route.hash })
  }

  reload () {
    location.reload()
  }
}
