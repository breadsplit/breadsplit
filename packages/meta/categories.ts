const colors = [
  'rgb(68, 120, 178)',
  'rgb(75, 160, 177)',
  'rgb(114, 195, 167)',
  'rgb(160, 217, 163)',
  'rgb(185, 222, 131)',
  'rgb(235, 210, 124)',
  'rgb(240, 179, 81)',
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
    icon: 'bed',
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
    icon: 'currency-usd-circle',
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

export const BuiltInCategoriesKeys = Object.keys(BuiltInCategories).filter(i => i !== 'unknown')

export const CategoryPresets: Record<string, (keyof typeof BuiltInCategories)[]> = {
  default: [
    'transport',
    'lodging',
    'groceries',
    'shopping',
    'entertainment',
    'food',
    'drinks',
    'snacks',
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
