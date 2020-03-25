import { Group, Operation, SharedGroupOptions } from '.'

export interface LocalGroupOptions {
  display_currency?: string
  pinned?: boolean
}

export interface ClientGroup {
  id: string
  base: Group
  operations: Operation[]
  online?: boolean
  lastsync?: number
  syncing_operations: string[]
  syncing_state: 'done' | 'in_progress' | 'error' | 'none'
  syncing_error: Error | null
  synced_operations: string[]

  // Options
  lastchanged: number
  options: SharedGroupOptions
  local_options: LocalGroupOptions
}
