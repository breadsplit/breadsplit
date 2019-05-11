import merge from 'lodash/merge'
import mapValues from 'lodash/mapValues'
import { GenerateId } from '~/utils/id_helper'
import { Member, MemberRoles, Group, Transaction, TransactionType, ClientGroup } from '~/types/models'
import { RootState, GroupState, UserState, AppOptions } from '~/types/store'
import { getUserAgent, getWebviewType, getOSType, isStandalone } from './ua'
import { acceptLanguage } from '~/locales'

export const MemberDefault = (overrides?: Partial<Member>): Member => merge({
  id: GenerateId.LocalMember(),
  name: '',
  role: MemberRoles.collaborator,
}, overrides)

export const GroupDefault = (overrides?: object): Group => {
  const group: Group = merge({
    id: GenerateId.LocalGroup(),
    name: '',
    options: {
      multiple_currencies: true,
    },
    timestamp: +new Date(),

    members: {},
    currencies: [],
    currency_records: [],
    transactions: [],
    activities: [],

    online: false,
  }, overrides)

  if (Array.isArray(group.members)) {
    const members = {}
    group.members.forEach((m) => {
      const member = MemberDefault(m)
      members[member.id] = member
    })
    group.members = members
  }
  else {
    group.members = mapValues(group.members, m => MemberDefault(m))
  }

  return group
}

export const ClientGroupDefault = (overrides?: Partial<ClientGroup>): ClientGroup => {
  const group = GroupDefault(overrides)
  return {
    id: group.id,
    base: group,
    operations: [],
    syncingOperations: [],
    lastchanged: +new Date(),
  }
}

export const TransactionDefault = (overrides?: Partial<Transaction>): Transaction => merge({
  id: GenerateId.Transaction(),
  timestamp: +new Date(),
  creditors: [],
  debtors: [],
  currency: '',
  creator: '',
  category: '',
  total_fee: 0,
  service_fee_rate: 0,
  type: TransactionType.expenses,
}, overrides)

export const GroupStateDefault = (overrides?: Partial<GroupState>): GroupState => merge({
  groups: {},
  currentId: null,
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

export const AppOptionsDefault = (overrides?: Partial<AppOptions>): AppOptions => merge({
  dark: false,
  firebase_server: 'development',
}, overrides)

export const RootStateDefault = (overrides?: Partial<RootState>): RootState => merge({
  browser_locale: acceptLanguage(),
  user_locale: null,
  loaded: false,
  group: GroupStateDefault(),
  user: UserStateDefault(),
  options: AppOptionsDefault(),
  messaging_token: null,
  ua: {
    raw: getUserAgent(),
    webview: getWebviewType(),
    os: getOSType(),
    bypass_webview: false,
    standalone: isStandalone(),
  },
}, overrides)
