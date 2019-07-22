export interface Category {
  name: string
  icon: string
  color: string
}

const colors = [
  'rgb(68, 120, 178)',
  'rgb(75, 160, 177)',
  'rgb(114, 195, 167)',
  'rgb(160, 217, 163)',
  'rgb(204, 234, 159)',
  'rgb(254, 232, 154)',
  'rgb(253, 202, 121)',
  'rgb(251, 163, 94)',
  'rgb(243, 120, 76)',
  'rgb(225, 82, 74)',
  'rgb(196, 44, 74)',
  'rgb(158, 1, 66)',
]

const DefaultCategories: Category[] = [
  {
    name: 'transport',
    icon: 'subway-variant',
    color: '',
  },
  {
    name: 'lodging',
    icon: 'hotel',
    color: '',
  },
  {
    name: 'travel',
    icon: 'beach',
    color: '',
  },
  {
    name: 'shopping',
    icon: 'shopping',
    color: '',
  },
  {
    name: 'entertainment',
    icon: 'cards-playing-outline',
    color: '',
  },
  {
    name: 'home',
    icon: 'home',
    color: '',
  },
  {
    name: 'food',
    icon: 'food',
    color: '',
  },
  {
    name: 'tips',
    icon: 'coin',
    color: '',
  },
  {
    name: 'transfer',
    icon: 'bank-transfer',
    color: '',
  },
  {
    name: 'other',
    icon: 'wallet-outline',
    color: '',
  },
].map((cat, i) => ({ ...cat, color: colors[i] }))

export default DefaultCategories

export const CategoryKeys = DefaultCategories.map(c => c.name)
