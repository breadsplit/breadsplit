declare class FirePlugin {
  loginWithGoogle(): Promise<firebase.auth.UserCredential>
  logout(): Promise<void>
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $fire: FirePlugin
  }
}

export default FirePlugin
