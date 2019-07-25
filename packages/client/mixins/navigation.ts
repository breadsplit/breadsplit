import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class NavigationMixin extends Vue {
  get navGroupId () {
    return this.$store.getters['group/currentId']
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

  openDialog (name: string, options?: object) {
    this.$router.push({
      query: Object.assign({}, options, { dialog: name }),
    })
  }

  closeDialog () {
    // @ts-ignore
    this.$router.replace({ query: null })
  }

  reload () {
    location.reload()
  }
}
