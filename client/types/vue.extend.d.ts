import { FirebasePlugin } from '../plugins/firebase'

declare module 'vue/types/vue' {
  interface Vue {
    // firebase plugin
    readonly $fire: FirebasePlugin

    // vue-clipboard2
    readonly $copyText: (s: string) => Promise<{text: string}>

    // global ui components
    readonly $confirm: (text: string, title?: string, options?: object) => Promise<boolean>
    readonly $snack: (text: string) => void
    readonly $loading: {
      open: (text: string) => void
      close: () => void
    }
  }
}
