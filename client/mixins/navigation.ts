import { Vue, Component } from 'nuxt-property-decorator'

function QuerySerialize(obj) {
  return Object.keys(obj).reduce((a: string[], k) => {
    if (obj[k] != null)
      a.push(`${k}=${encodeURIComponent(obj[k])}`)
    return a
  }, []).join('&')
}

@Component
export default class NavigationMixin extends Vue {
  get navGroupId() {
    return this.$store.getters['group/currentId']
  }

  gotoHome() {
    this.$router.push('/')
  }

  gotoGroup(id?: string) {
    this.$router.push(`/group/${id || this.navGroupId}`)
  }

  gotoNewTransaction(options = { type: 'expense', uid: undefined }, groupid?: string) {
    this.$router.push(`/group/${groupid || this.navGroupId}/new_trans?${QuerySerialize(options)}`)
  }

  gotoTransaction(transId: string, groupid?: string) {
    this.$router.push(`/group/${groupid || this.navGroupId}/trans/${transId}`)
  }

  reload() {
    location.reload()
  }
}
