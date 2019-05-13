import { Vue, Component } from 'vue-property-decorator'

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

  gotoNewTransaction(options = { type: 'expense', uid: undefined }) {
    this.$router.push(`/group/${this.navGroupId}/new_trans?${QuerySerialize(options)}`)
  }
}
