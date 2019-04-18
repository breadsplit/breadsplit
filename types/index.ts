type MemberId = string
type BookId = string
type TransactionId = string

export const enum MemberRoles {
  owner = 'owner',
  collaborator = 'collaborator',
  participant = 'participant',
  visitor = 'visitor',
}

export const enum ActivityEvent {
  book_creation,
  // TODO:
}

export interface Weight {
  member: MemberId
  weight?: number
  fee?: number
  percent?: number
}

export interface Member {
  id: MemberId
  name: string
  role: MemberRoles

  email?: string
  avatar?: string
  uid?: MemberId
}

export interface Transaction {
  id: TransactionId
  time: number
  desc?: string
  category?: string
  currency: string
  total_fee: number
  creditors: Weight[]
  debtors: Weight[]
  creator: MemberId
}

export interface CurrencyRecord {
  id: string
  from_currency: string
  from_fee: number
  to_currency: string
  to_fee: number
  handling_fee: number
  time: number
  desc: string
}

export interface CurrencyChangeRate {
  from_currency: string
  to_currency: string
  change_rate: number
}

export interface Activity {
  id: string
  time: number
  operator: MemberId
  event: ActivityEvent
  // TODO:
}

export interface BookOptions {
  multiple_currencies: Boolean,
}

export interface Book {
  // Basic
  id: BookId
  name: string
  color?: string
  icon?: string
  options: BookOptions
  time_created: number

  // Records
  members: Member[]
  currencies: string[]
  currency_records: CurrencyRecord[]
  transactions: Transaction[]
  activities: Activity[]

  // Online
  serverid?: string
  lastsync?: number
  online: boolean
}
