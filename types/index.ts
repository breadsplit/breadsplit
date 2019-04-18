export enum MemberRoles {
  owner = 'owner',
  collaborator = 'collaborator',
  participant = 'participant',
  visitor = 'visitor',
}

export interface Member {
  id: string,
  name: string,
  email?: string,
  avatar?: string,
  role: MemberRoles,
  uid?: String,
}

export interface Transaction {
  id: string,
  // TODO:
}

export interface CurrencyRecord {
  id: string,
  // TODO:
}

export interface Activity {
  id: string,
  // TODO:
}

export interface BookOptions {
}

export interface Book {
  // Basic
  id: string,
  name: string,
  color?: string,
  icon?: string,
  options: BookOptions,

  // Records
  members: Member[],
  currencies: string[],
  currency_records: CurrencyRecord[],
  transactions: Transaction[],
  activities: Activity[],

  // Online
  serverid?: string,
  lastsync?: number,
  online: boolean,
}
