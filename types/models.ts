import { TransOperation } from './operation_transformer'

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

export interface Weight {
  uid: UID
  weight?: number
  fee?: number
  percent?: number
}

export interface Member {
  uid: UID | null
  name: string
  role: MemberRoles
  defaultWeight?: number
  removed?: boolean
}

export interface UserInfo {
  uid: UID | null
  anonymous: boolean
  email?: string
  name: string
  avatar_url?: string
  lastupdate?: number

  // client side only
  lastsync?: number
}

export interface UserMemberInfo extends Member, UserInfo {
  original_name?: string
}

export interface Transaction {
  id: string
  desc?: string
  category?: string
  currency: string
  total_fee: number
  service_fee_rate?: number
  creditors: Weight[]
  debtors: Weight[]
  creator: UID
  type: TransactionType
  tags?: string[]
  note?: string
  location?: string | object
  timestamp: number
  timezone?: string
}

export interface CurrencyRecord {
  id: UID
  from_currency: string
  from_fee: number
  to_currency: string
  to_fee: number
  handling_fee: number
  timestamp: number
  desc: string
}

export interface CurrencyChangeRate {
  from_currency: string
  to_currency: string
  change_rate: number
}

export interface Activity {
  timestamp: number
  timezone?: string
  by: UID
  action: ActivityAction
  entity: Entity
  update_fields?: string | string[]
  entity_id?: string
  entity_name?: string
  entity_desc?: string
  meta?: any
}

export interface GroupOptions {
  multiple_currencies: boolean
}

export interface Budget {
  creator: UID
  from: number
  to: number
  budget: number
  currency: string
}

export interface Group {
  // Basic
  id: string
  name: string
  color?: string
  icon?: string
  options: GroupOptions
  timestamp: number
  budgets: Budget[]

  // Records
  members: Record<UID, Member>
  currencies: string[]
  currency_records: CurrencyRecord[]
  transactions: Transaction[]
  activities: Activity[]

  online?: boolean
}

export interface Operation extends TransOperation {
  uid?: string
  server_timestamp?: number
}

export interface ClientGroup {
  id: string
  base: Group
  operations: Operation[]
  online?: boolean
  lastsync?: number
  syncingOperations: string[]

  // Options
  lastchanged: number
  favorite?: boolean
  open: boolean
}

export interface TokenRecord {
  token: string
  locale: string
  enabled: boolean
  uid?: string
}

export interface FeedbackOptions {
  email: string | null
  content: string
}

export interface Feedback extends FeedbackOptions {
  uid: string | null
  timestamp: number
}
