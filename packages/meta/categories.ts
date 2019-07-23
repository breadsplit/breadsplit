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
  travel: {
    icon: 'beach',
    color: '',
  },
  shopping: {
    icon: 'shopping',
    color: '',
  },
  entertainment: {
    icon: 'cards-playing-outline',
    color: '',
  },
  utilities: {
    icon: 'home-assistant',
    color: '',
  },
  food: {
    icon: 'food',
    color: '',
  },
  drinks: {
    icon: 'beer',
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
    color: '',
  },
  unknown: {
    icon: 'help-box',
    color: '',
  },
}

Object.values(BuiltInCategories).map((v, i) => v.color = colors[i])

export const CategoryPresets: Dictionary<(keyof typeof BuiltInCategories)[]> = {
  default: [
    'transport',
    'lodging',
    'travel',
    'shopping',
    'entertainment',
    'utilities',
    'food',
    'drinks',
    'tickets',
    'tips',
    'transfer',
    'other',
  ],
  travel: [
    'transport',
    'lodging',
    'travel',
    'shopping',
    'entertainment',
    'food',
    'drinks',
    'tickets',
    'tips',
    'transfer',
    'other',
  ],
  house: [
    'transport',
    'lodging',
    'travel',
    'shopping',
    'entertainment',
    'food',
    'drinks',
    'utilities',
    'transfer',
    'other',
  ],
}
