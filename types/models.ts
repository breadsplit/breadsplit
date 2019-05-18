import { TransOperation } from 'opschain'

type uid = string

export type MemberRoles =
| 'owner'
| 'collaborator'
| 'participant'
| 'visitor'

export const enum ActivityAction {
  insert = 'insert',
  remove = 'remove',
  update = 'update',
  publish = 'publish',
}

export const enum Entity {
  member = 'member',
  viewer = 'viewer',
  group = 'group',
  transaction ='transaction',
  currency_record = 'currency_record',
}

export const enum TransactionType {
  expenses = 'expenses',
  transfer = 'transfer',
}

export interface Weight {
  uid: uid
  weight?: number
  fee?: number
  percent?: number
}

export interface Member {
  id: uid
  name: string
  role: MemberRoles
  defaultWeight?: number
  removed?: boolean
}

export interface UserInfo {
  uid: uid | null
  anonymous: boolean
  email?: string
  name: string
  avatar_url?: string
  lastupdate?: number

  // client side only
  lastsync?: number
}

export interface Transaction {
  id: string
  timestamp: number
  desc?: string
  category?: string
  currency: string
  total_fee: number
  service_fee_rate?: number
  creditors: Weight[]
  debtors: Weight[]
  creator: uid
  type: TransactionType
  hashtags?: string[]
  note?: string
}

export interface CurrencyRecord {
  id: uid
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
  by: uid
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
  creator: uid
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
  members: Record<uid, Member>
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

export interface ServerGroup {
  id: string
  // user ids
  viewers: string[]
  owner: string
  open: boolean

  present: Group
  operations: string[]
}

export interface ServerOperations {
  operations: Operation[]
}

export interface ServerBase {
  base: Group
}

export interface TokenRecord {
  token: string
  locale: string
  enabled: boolean
  uid?: string
}

export interface FeedbackOptions {
  email: string | null
  title: string
  content: string
}

export interface Feedback extends FeedbackOptions {
  uid: string | null
  timestamp: number
}

export interface GroupMetaChanges {
  name?: string
  icon?: string
  color?: string
  options?: Partial<GroupOptions>
}
