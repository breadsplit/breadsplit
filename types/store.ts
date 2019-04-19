import { Group } from '.'

export interface GroupState {
  groups: { [s: string]: Group }
  currentId: string | null
}

export interface RootState {
  locale: string
  loaded: boolean
  group: GroupState
}
