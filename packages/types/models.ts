import { TransOperation } from './operation_transformer'
import { UID, MemberRoles, Splitmode, TransactionType, ActivityAction, Entity, ExchangeRecord } from '.'

export interface Weight {
  uid: UID
  weight?: number
  fee?: number
  percent?: number
  locked?: boolean
}

export interface Category {
  id: string
  icon: string
  color: string
  text: string
  removed?: boolean
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

export interface TransactionExchangeRecord {
  from: string
  to: string
  rate: number
  date: string
  note?: string
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
  splitmode: Splitmode
  splitmode_creditors: Splitmode
  attached_images?: string[]
  creator: UID
  type: TransactionType
  tags?: string[]
  note?: string

  exchange_rate?: ExchangeRecord
  exchange_rate_override?: TransactionExchangeRecord

  location?: string | object
  timestamp: number
  timezone?: string
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
  entity_color?: string
  entity_icon?: string
  meta?: any
}

export interface Budget {
  creator: UID
  from: number
  to: number
  budget: number
  currency: string
}

export interface SharedGroupOptions {
  public: boolean
}

export interface Group {
  // Basic
  id: string
  name: string
  color?: string
  icon?: string
  timestamp: number
  budgets: Budget[]

  categories?: (Category | string)[]

  // Records
  members: Record<UID, Member>
  main_currency: string
  transactions: Transaction[]
  activities: Activity[]

  online?: boolean
}

export interface Operation extends TransOperation {
  uid?: string
  server_timestamp?: number
}
