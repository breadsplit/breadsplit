import merge from 'lodash/merge'
import mapValues from 'lodash/mapValues'
import { Member, Group, Transaction, ClientGroup, SharedGroupOptions, LocalGroupOptions } from '../types'
import { Category } from '../types/models'
import { GenerateId } from './id_helper'

export const defaultCurrency = 'USD'

export const MemberDefault = (overrides?: Partial<Member>): Member => merge({
  uid: GenerateId.LocalMember(),
  name: '',
  role: 'collaborator',
}, overrides)

export const GroupDefault = (overrides?: any): Group => {
  const group: Group = merge({
    id: GenerateId.LocalGroup(),
    name: '',
    options: {
      multiple_currencies: true,
    },
    timestamp: +new Date(),
    budgets: [],

    members: {},
    main_currency: '',
    transactions: [],
    activities: [],

    online: false,
  }, overrides)

  if (Array.isArray(group.members)) {
    const members: Record<string, Member> = {}
    group.members.forEach((m) => {
      const member = MemberDefault(m)
      members[member.uid as string] = member
    })
    group.members = members
  }
  else {
    group.members = mapValues(group.members, m => MemberDefault(m))
  }

  return group
}

export const SharedGroupOptionsDefault = (overrides?: Partial<SharedGroupOptions>): SharedGroupOptions => merge({
  public: true,
}, overrides)

export const LocalGroupOptionsDefault = (overrides?: Partial<LocalGroupOptions>): LocalGroupOptions => merge({
  display_currency: null,
  pinned: false,
}, overrides)

export const ClientGroupDefault = (overrides?: Partial<ClientGroup>): ClientGroup => {
  const group = GroupDefault(overrides)
  return {
    id: group.id,
    base: group,
    operations: [],
    lastchanged: +new Date(),
    options: SharedGroupOptionsDefault(),
    local_options: LocalGroupOptionsDefault(),

    syncing_operations: [],
    syncing_state: 'none',
    syncing_error: null,
    synced_operations: [],
  }
}

export const CategoryDefault = (overrides?: Partial<Category>): Category => merge({
  id: GenerateId.Category(),
  text: '',
  icon: 'help-circle-outline',
  color: '#555',
}, overrides)

export const TransactionDefault = (overrides?: Partial<Transaction>): Transaction => merge({
  id: GenerateId.Transaction(),
  timestamp: +new Date(),
  timestamp_created: +new Date(),
  creditors: [],
  debtors: [],
  currency: defaultCurrency,
  creator: '',
  category: '',
  total_fee: 0,
  service_fee_rate: 0,
  splitmode: 'average',
  splitmode_creditors: 'amount',
  type: 'expense',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}, overrides)
