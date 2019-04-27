import { Group } from '.'

export interface GroupState {
  groups: { [s: string]: Group }
  currentId: string|null
}

export interface UserInfo {
  uid: string | null
  anonymous: boolean
  email?: string
  display_name: string
  avatar_url?: string
}

export interface UserState {
  info: UserInfo
  online: boolean
}

export interface RootState {
  user_locale: string|null
  browser_locale: string
  loaded: boolean
  dark: boolean
  group: GroupState
  user: UserState
}
