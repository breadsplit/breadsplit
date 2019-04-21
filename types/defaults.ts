import randomstr from '~/utils/randomstr'
import { Member, MemberRoles, Group, Transaction, TransactionType } from './index'
import { RootState, GroupState } from './store'
import { merge } from 'lodash'

export const MemberDefault = (overrides?: object): Member => merge({
  id: `m:${randomstr(5)}`,
  name: '',
  role: MemberRoles.collaborator,
}, overrides)

export const GroupDefault = (overrides?: object): Group => {
  const group: Group = merge({
    id: randomstr(5),
    name: '',
    options: {
      multiple_currencies: true,
    },
    timestamp: +new Date(),

    members: [],
    currencies: [],
    currency_records: [],
    transactions: [],
    activities: [],

    online: false,
  }, overrides)

  group.members = group.members.map(m => MemberDefault(m))
  return group
}

export const TransactionDefault = (overrides?: object): Transaction => merge({
  id: `t:${randomstr(16)}`,
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

export const RootStateDefault = (overrides?: object): RootState => merge({
  browser_locale: 'en',
  user_locale: null,
  loaded: false,
  group: GroupStateDefault(),
}, overrides)
