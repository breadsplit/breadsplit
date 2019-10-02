import { ClientGroup, UserInfo, ExchangeRecord, Solution, Balance, Group } from '~/types'
import { WebviewType, OSType } from '~/utils'

export interface GroupState {
  groups: Record<string, ClientGroup>
  currentId: string|null
  unreads: Record<string, number>
  cache: {
    groups: Record<string, Group>
    balances: Record<string, Balance[]>
    solutions: Record<string, Solution[]>
  }
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
  temp: {
    primary_color_override: string | null
  }
}
