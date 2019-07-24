import { Dictionary } from 'vuex'

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

export const BuiltInCategories = {
  transport: {
    icon: 'subway-variant',
    color: '',
  },
  lodging: {
    icon: 'hotel',
    color: '',
  },
  groceries: {
    icon: 'cart',
    color: '',
  },
  shopping: {
    icon: 'shopping',
    color: '',
  },
  entertainment: {
    icon: 'chess-knight',
    color: '',
  },
  utilities: {
    icon: 'home-assistant',
    color: '',
  },
  food: {
    icon: 'silverware-fork-knife',
    color: '',
  },
  drinks: {
    icon: 'beer',
    color: '',
  },
  snacks: {
    icon: 'food-croissant',
    color: '',
  },
  tickets: {
    icon: 'ticket',
    color: '',
  },
  tips: {
    icon: 'coin',
    color: '',
  },
  other: {
    icon: 'wallet-outline',
    color: '',
  },
  transfer: {
    icon: 'bank-transfer',
    color: '#4f4929',
  },
  unknown: {
    icon: 'help-box',
    color: '#555',
  },
}

Object.values(BuiltInCategories).map((v, i) => v.color = colors[i])

export const CategoryPresets: Dictionary<(keyof typeof BuiltInCategories)[]> = {
  default: [
    'transport',
    'lodging',
    'groceries',
    'shopping',
    'entertainment',
    'utilities',
    'food',
    'drinks',
    'snacks',
    'tickets',
    'tips',
    'transfer',
    'other',
  ],
  travel: [
    'transport',
    'lodging',
    'groceries',
    'shopping',
    'entertainment',
    'food',
    'drinks',
    'snacks',
    'tickets',
    'tips',
    'transfer',
    'other',
  ],
  house: [
    'transport',
    'lodging',
    'groceries',
    'shopping',
    'entertainment',
    'food',
    'drinks',
    'utilities',
    'transfer',
    'other',
  ],
}
