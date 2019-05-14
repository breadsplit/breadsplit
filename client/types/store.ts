import { ClientGroup, UserInfo } from '~/types'
import { OSType, WebviewType } from '~/utils/ua'

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
  group: GroupState
  user: UserState
  options: AppOptions
  messaging_token: string | null
  ua: {
    raw: string
    webview?: WebviewType
    os: OSType
    bypass_webview: boolean
    standalone: boolean
  }
}
