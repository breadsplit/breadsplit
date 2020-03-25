import { Vue, Component } from 'nuxt-property-decorator'
import { reactiveHash } from '~/utils'

@Component
export default class NavigationMixin extends Vue {
  get navGroupId() {
    return this.$store.getters['group/currentId']
  }

  hash = reactiveHash.value as any

  updateHash(field: string, value: any, updateHistory = false) {
    reactiveHash.updateField(field, value, updateHistory)
  }

  clearHash(updateHistory = false) {
    reactiveHash.update({}, updateHistory)
  }

  gotoHome() {
    this.$router.push('/')
  }

  gotoGroup(id?: string) {
    this.$router.push(`/group/${id || this.navGroupId}`)
  }

  gotoNewTransaction(options: Record<string, any> = { type: 'expense' }) {
    this.openDialog('trans', options)
  }

  gotoTransaction(transid: string, groupid?: string) {
    this.openDialog('trans', { transid, groupid })
  }

  gotoNewGroup(options: Record<string, any> = {}) {
    this.openDialog('group', options)
  }

  gotoNewCategory(options: Record<string, any> = {}) {
    this.openDialog('category', options)
  }

  gotoCategories(options: Record<string, any> = {}) {
    this.openDialog('categories', options)
  }

  openDialog(name: string, options?: object) {
    this.$router.push({
      query: Object.assign({}, options, { dialog: name }),
      hash: this.$route.hash,
    })
  }

  async closeDialog() {
    try {
      await this.$router.replace({ query: {}, hash: this.$route.hash })
    }
    catch (e) {}
  }

  reload() {
    location.reload()
  }
}
