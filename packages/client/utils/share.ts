import Vue from 'vue'

export async function Share (vm: Vue, title: string, text: string, url: string) {
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
