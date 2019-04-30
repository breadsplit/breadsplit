import { GenerateId } from '~/utils/randomstr'
import { Member, MemberRoles, Group, Transaction, TransactionType, ClientGroup } from '../types/models'
import { RootState, GroupState, UserState } from '../types/store'
import { merge, mapValues } from 'lodash'

export const MemberDefault = (overrides?: object): Member => merge({
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

    memberIds: [],
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

export const ClientGroupDefault = (overrides?: object): ClientGroup => {
  return {
    base: GroupDefault(overrides),
    operations: [],
  }
}

export const TransactionDefault = (overrides?: object): Transaction => merge({
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

export const GroupStateDefault = (overrides?: object): GroupState => merge({
  groups: {},
  currentId: null,
}, overrides)

export const UserStateDefault = (overrides?: object): UserState => merge({
  info: {
    uid: null,
    anonymous: true,
    display_name: '',
  },
  online: false,
}, overrides)

export const RootStateDefault = (overrides?: object): RootState => merge({
  browser_locale: 'en',
  user_locale: null,
  loaded: false,
  dark: false,
  group: GroupStateDefault(),
  user: UserStateDefault(),
}, overrides)
