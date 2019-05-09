import { FirebasePlugin } from '~/plugins/firebase'
import { SnackOptions } from '~/types/models'

declare module 'vue/types/vue' {
  interface Vue {
    // firebase plugin
    readonly $fire: FirebasePlugin

    // vue-clipboard2
    readonly $copyText: (s: string) => Promise<{text: string}>

    // global ui components
    readonly $confirm: (text: string, title?: string, options?: object) => Promise<boolean>
    readonly $snack: (text: string, options?: SnackOptions) => void
    readonly $apploading: {
      open: (text: string) => void
      close: () => void
    }
  }
}
