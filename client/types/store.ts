import { ClientGroup, UserInfo, ExchangeRecord } from '~/types'
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

export interface CacheState {
  exchange_rates: Record<string, ExchangeRecord>
}

export interface AppOptions {
  dark: boolean
}

export interface RootState {
  user_locale: string|null
  browser_locale: string
  group: GroupState
  user: UserState
  cache: CacheState
  options: AppOptions
  messaging_token: string | null
  ua: {
    raw: string
    webview?: WebviewType
    os: OSType
    standalone: boolean
  }
  app: {
    init: boolean
    version: string
  }
}
