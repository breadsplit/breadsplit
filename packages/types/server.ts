import { Group, Operation, UID } from '.'

export interface ServerGroup {
  id: string
  viewers: UID[]
  owner: string
  public: boolean

  present: Group
  operations: string[]
}

export interface ServerOperations {
  operations: Operation[]
}

export interface ServerBase {
  base: Group
}
