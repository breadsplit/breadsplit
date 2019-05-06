import { ClientGroup, UserInfo } from './models'

export interface GroupState {
  groups: { [s: string]: ClientGroup }
  currentId: string|null
}

export interface UserState {
  me: UserInfo
  online: boolean
  users: {
    [uid: string]: UserInfo
  }
}

export interface AppOptions {
  dark: boolean
  firebase_server: string
}
export interface RootState {
  user_locale: string|null
  browser_locale: string
  loaded: boolean
  group: GroupState
  user: UserState
  options: AppOptions
}
