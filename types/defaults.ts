import randomstr from '~/utils/randomstr'
import { Member, MemberRoles, Group, Transaction, TransactionType } from './index'
import { RootState, GroupState } from './store'

export const MemberDefault = (): Member => ({
  id: `m:${randomstr(5)}`,
  name: '',
  role: MemberRoles.collaborator,
})

export const GroupDefault = (): Group => ({
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
})

export const TransactionDefault = (): Transaction => ({
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
})

export const GroupStateDefault = (): GroupState => ({
  groups: {},
  currentId: null,
})

export const RootStateDefault = (): RootState => ({
  browser_locale: 'en',
  user_locale: null,
  loaded: false,
  group: GroupStateDefault(),
})
