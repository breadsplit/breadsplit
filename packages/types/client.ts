import { Group, Operation, SharedGroupOptions } from '.'

export interface LocalGroupOptions {
  display_currency?: string
  favorite?: boolean
}

export interface ClientGroup {
  id: string
  base: Group
  operations: Operation[]
  online?: boolean
  lastsync?: number
  syncing_operations: string[]

  // Options
  lastchanged: number
  options: SharedGroupOptions
  local_options: LocalGroupOptions
}
