import merge from 'lodash/merge'
import { RootState, GroupState, UserState, AppOptions, CacheState } from '../types/store'
import { getUserAgent, getWebviewType, getOSType, isStandalone, acceptLanguage } from '../utils'

export const GroupStateDefault = (overrides?: Partial<GroupState>): GroupState => merge({
  groups: {},
  currentId: null,
  unreads: {},
  cache: {
    groups: {},
    balances: {},
    solutions: {},
  },
}, overrides)

export const UserStateDefault = (overrides?: Partial<UserState>): UserState => merge({
  me: {
    uid: null,
    anonymous: true,
    name: '',
  },
  users: {},
  online: false,
}, overrides)

export const CacheStateDefault = (overrides?: Partial<CacheState>): CacheState => merge({
  exchange_rates: {},
}, overrides)

export const AppOptionsDefault = (overrides?: Partial<AppOptions>): AppOptions => merge({
  dark: false,
  firebase_server: 'development',
}, overrides)

export const RootStateDefault = (overrides?: Partial<RootState>): RootState => merge({
  browser_locale: acceptLanguage(),
  user_locale: null,
  group: GroupStateDefault(),
  user: UserStateDefault(),
  cache: CacheStateDefault(),
  options: AppOptionsDefault(),
  messaging_token: null,
  ua: {
    raw: getUserAgent(),
    webview: getWebviewType(),
    os: getOSType(),
    bypass_webview: false,
    standalone: isStandalone(),
  },
  app: {
    init: false,
    version: '0.0.0',
  },
  temp: {
    primary_color_override: null,
  },
}, overrides)
