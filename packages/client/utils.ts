import Vue from 'vue'

export * from '../shared/utils'

export async function Share(vm: Vue, title: string, text: string, url: string) {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      })
    }
    catch (e) { }
  }
  else {
    await vm.$copyText(url)
    vm.$snack(vm.$t('ui.share_link_copied', '').toString())
  }
}

export function Vibrate(duration = 100) {
  if (window.navigator && window.navigator.vibrate)
    window.navigator.vibrate(duration)
}
