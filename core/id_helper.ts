import nanoid from 'nanoid'

export const GenerateId = {
  LocalGroup: () => `L:${nanoid(10)}`,
  OnlineGroup: () => `O:${nanoid(16)}`,
  Transaction: () => `T:${nanoid(16)}`,
  LocalMember: () => `M:${nanoid(10)}`,
}

export const IsThisId = {
  LocalMember: (id: string) => id.startsWith('M:'),
  LocalGroup: (id: string) => id.startsWith('L:'),
  OnlineGroup: (id: string) => id.startsWith('O:'),
  Transaction: (id: string) => id.startsWith('T:'),
  UID: (id: string) => !id.startsWith('M:'),
}
