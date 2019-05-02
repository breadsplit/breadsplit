import { FirebasePlugin } from '../plugins/firebase'

declare module 'vue/types/vue' {
  interface Vue {
    readonly $fire: FirebasePlugin
  }
}
