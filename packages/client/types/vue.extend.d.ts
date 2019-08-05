import { TranslateResult } from 'vue-i18n'
import dayjs from 'dayjs'
import { FirebasePlugin } from '~/plugins/firebase'
import { SnackOptions } from '~/types'

declare module 'vue/types/vue' {
  interface Vue {
    // firebase plugin
    readonly $fire: FirebasePlugin

    // vue-clipboard2
    readonly $copyText: (s: string) => Promise<{text: string}>

    // dayjs
    readonly $dt: typeof dayjs

    // global ui components
    readonly $confirm: (title: string|TranslateResult, text?: string|TranslateResult, options?: object) => Promise<boolean>
    readonly $prompt: (title: string|TranslateResult, value: string, options?: object) => Promise<string>
    readonly $snack: (text: string|TranslateResult, options?: SnackOptions) => void
    readonly $apploading: {
      open: (text: string|TranslateResult) => void
      close: () => void
    }
    readonly $currency: {
      select: () => Promise<string|null>
    }
  }
}
