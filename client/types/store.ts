import { Group } from '.'

export interface GroupState {
  groups: { [s: string]: Group }
  currentId: string|null
}

export interface RootState {
  user_locale: string|null
  browser_locale: string
  loaded: boolean
  dark: boolean
  group: GroupState
}
