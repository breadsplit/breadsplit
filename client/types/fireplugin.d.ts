import { firestore } from 'firebase'

declare class FirePlugin {
  auth: firebase.auth.Auth
  db: firebase.firestore.Firestore

  signup(email: string, password: string): Promise<firebase.auth.UserCredential>
  loginWithEmail(email: string, password: string): Promise<firebase.auth.UserCredential>
  loginWithGoogle(): Promise<firebase.auth.UserCredential>
  logout(): Promise<void>

  switchToOnline(options: {groupid: string; memberid?: string}): Promise<void>
  deleteGroup(groupid: string): Promise<void>
  syncGroup(groupid: string): Promise<void>
  subscribeGroup(groupid: string): void
  pushGroup(groupid: string): void
  fetchAllGroups(subscribe?: boolean): Promise<firestore.DocumentData>
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $fire: FirePlugin
  }
}

export default FirePlugin
