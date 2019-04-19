import { Book } from '.'

export interface BookState {
  books: { [s: string]: Book }
  currentId: string | null
}

export interface RootState {
  locale: string
  loaded: boolean
  book: BookState
}
