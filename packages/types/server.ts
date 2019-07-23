import { SharedGroupOptions } from './models'
import { Group, Operation, UID } from '.'

export interface ServerGroup {
  id: string
  viewers: UID[]
  owner: string

  present: Group
  operations: string[]

  options: SharedGroupOptions
}

export interface ServerOperations {
  operations: Operation[]
}

export interface ServerBase {
  base: Group
}
