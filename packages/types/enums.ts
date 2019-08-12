
export type Splitmode = 'average' | 'amount' | 'percent' | 'weight'

export type UID = string

export type MemberRoles =
  | 'owner'
  | 'collaborator'
  | 'participant'
  | 'visitor'

export type TransactionType =
  | 'expenses'
  | 'transfer'

export type ActivityAction =
  | 'insert'
  | 'remove'
  | 'update'
  | 'publish'

export type Entity =
  | 'member'
  | 'viewer'
  | 'group'
  | 'transaction'
  | 'currency_record'
  | 'category'

export type ExchangeProvider =
  'fixer'
