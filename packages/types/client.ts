import { Group, Operation, SharedGroupOptions } from '.'

export interface LocalGroupOptions {
  displayCurrency?: string
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
  options: SharedGroupOptions
  localOptions: LocalGroupOptions
}
