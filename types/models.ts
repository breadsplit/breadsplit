import { TransOperation } from 'operation-sync'

export const enum MemberRoles {
  owner = 'owner',
  collaborator = 'collaborator',
  participant = 'participant',
  visitor = 'visitor',
}

export const enum ActivityAction {
  insert = 'insert',
  remove = 'remove',
  update = 'update',
}

export const enum Entity {
  member = 'member',
  group ='group',
  transaction ='transaction',
  currency_record = 'currency_record',
}

export const enum TransactionType{
  expenses = 'expenses',
  transfer = 'transfer',
}

export interface Weight {
  memberId: string
  weight?: number
  fee?: number
  percent?: number
}

export interface Member {
  id: string
  name: string
  role: MemberRoles
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
  creator: string
  type: TransactionType
}

export interface CurrencyRecord {
  id: string
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
  id: string
  timestamp: number
  by: string
  action: ActivityAction
  entity: Entity
  // TODO:
}

export interface GroupOptions {
  multiple_currencies: boolean
}

export interface Group {
  // Basic
  id: string
  name: string
  color?: string
  icon?: string
  options: GroupOptions
  timestamp: number

  // Records
  memberIds: string[]
  members: {[s: string]: Member}
  currencies: string[]
  currency_records: CurrencyRecord[]
  transactions: Transaction[]
  activities: Activity[]

  online?: boolean
}

interface Operation extends TransOperation {
  uid?: string
  serverTs?: number
}

export interface ClientGroup {
  id: string
  base: Group
  operations: Operation[]
  online?: boolean
  lastsync?: number
}

export interface ServerGroup {
  id: string
  // user ids
  viewers: string[]
  owner: string

  base: Group
  operations: Operation[]
}
