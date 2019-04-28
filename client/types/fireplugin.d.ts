declare class FirePlugin {
  auth: firebase.auth.Auth
  db: firebase.firestore.Firestore

  signup(email: string, password: string): Promise<firebase.auth.UserCredential>
  loginWithEmail(email: string, password: string): Promise<firebase.auth.UserCredential>
  loginWithGoogle(): Promise<firebase.auth.UserCredential>
  logout(): Promise<void>

  syncGroup(groupid: string): void
  subscribeGroup(groupid: string): void
  pushGroup(groupid: string): void
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $fire: FirePlugin
  }
}

export default FirePlugin
