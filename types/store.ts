import { Book } from '.'

export interface BookState {
  books: Book[],
  currentIndex: number,
}

export interface RootState {
  locale: string,
  loaded: boolean,
}
