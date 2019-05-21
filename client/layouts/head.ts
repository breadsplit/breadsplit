import Vue from 'vue'

export default function head(this: Vue) {
  const appname = process.env.RELEASE_CHANNEL === 'dev'
    ? this.$t('appname_dev')
    : this.$t('appname')

  if (this.$route.path !== '/') {
    return {
      titleTemplate: `%s - ${appname}`,
    }
  }
  return {
    title: appname.toString(),
  }
}
