import nanoid from 'nanoid'

export const GenerateId = {
  LocalGroup: () => `L:${nanoid(10)}`,
  OnlineGroup: () => `O:${nanoid(16)}`,
  Transaction: () => `T:${nanoid(16)}`,
  LocalMember: () => `M:${nanoid(10)}`,
  Category: () => `C:${nanoid(6)}`,
}

export const IdMe = 'me'

export const IsThisId = {
  LocalMember: (id?: string|null) => id && id.startsWith('M:'),
  LocalGroup: (id?: string|null) => id && id.startsWith('L:'),
  OnlineGroup: (id?: string|null) => id && id.startsWith('O:'),
  Transaction: (id?: string | null) => id && id.startsWith('T:'),
  Category: (id?: string|null) => id && id.startsWith('C:'),
  UID: (id?: string|null) => id && !id.startsWith('M:') && id !== IdMe,
  Me: (id?: string|null) => id === IdMe,
}
