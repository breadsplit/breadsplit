import { ClientGroup, UserInfo } from './models'

export interface GroupState {
  groups: { [s: string]: ClientGroup }
  currentId: string|null
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
