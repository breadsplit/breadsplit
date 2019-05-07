import Vue from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { RootState } from '~/types/store'

import 'dayjs/locale/en'
import 'dayjs/locale/zh-tw'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/ja'
import 'dayjs/locale/fr'

dayjs.extend(relativeTime)

Vue.use(() => {
  Vue.prototype.$dt = dayjs
})

export default ({ store }) => {
  // set dayjs locale on store locale changed
  store.watch(
    (state: RootState) => state.user_locale || state.browser_locale || 'en',
    (locale: string) => dayjs.locale((locale || '').toLowerCase()),
    { immediate: true }
  )
}
