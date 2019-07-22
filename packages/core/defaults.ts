import merge from 'lodash/merge'
import mapValues from 'lodash/mapValues'
import { Member, Group, Transaction, ClientGroup } from '../types'
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
    currencies: [],
    currency_records: [],
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

export const ClientGroupDefault = (overrides?: Partial<ClientGroup>): ClientGroup => {
  const group = GroupDefault(overrides)
  return {
    id: group.id,
    base: group,
    operations: [],
    syncingOperations: [],
    lastchanged: +new Date(),
    public: true,
  }
}

export const TransactionDefault = (overrides?: Partial<Transaction>): Transaction => merge({
  id: GenerateId.Transaction(),
  timestamp: +new Date(),
  creditors: [],
  debtors: [],
  currency: defaultCurrency,
  creator: '',
  category: '',
  total_fee: 0,
  service_fee_rate: 0,
  type: 'expenses',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}, overrides)
