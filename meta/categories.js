const DefaultCategories = [
  {
    name: 'transport',
    icon: 'subway-variant',
  },
  {
    name: 'lodging',
    icon: 'hotel',
  },
  {
    name: 'travel',
    icon: 'beach',
  },
  {
    name: 'food',
    icon: 'food',
  },
  {
    name: 'transfer',
    icon: 'bank-transfer',
  },
  {
    name: 'other',
    icon: 'help-rhombus-outline',
  },
]

export default DefaultCategories

export const CategoryKeys = DefaultCategories.map(c => c.name)
