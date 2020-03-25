import { Workbox } from 'workbox-window'

export default async({ app }: any) => {
  // @ts-ignore
  const workbox: Workbox = await window.$workbox

  if (workbox) {
    // Service worker is available
    workbox.addEventListener('installed', (e) => {
      // @ts-ignore
      if (e.isUpdate) {
        if (confirm('New content is available!. Click OK to refresh'))
          window.location.reload()
      }
    })
  }
}
