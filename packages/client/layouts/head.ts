import Vue from 'vue'
import { RELEASE_CHANNEL } from '~/../meta/env'

export default function head(this: Vue) {
  const appname = RELEASE_CHANNEL === 'dev'
    ? this.$t('appname_dev')
    : this.$t('appname')

  const titleTemplate = `%s - ${appname}`

  if (this.$route.path !== '/') {
    return {
      titleTemplate,
    }
  }
  return {
    title: appname.toString(),
    titleTemplate,
  }
}
