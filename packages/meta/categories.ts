export interface Category {
  name: string
  icon: string
  color: string
}

const DefaultCategories: Category[] = [
  {
    name: 'transport',
    icon: 'subway-variant',
    color: '#2196F3',
  },
  {
    name: 'lodging',
    icon: 'hotel',
    color: '#e55f54',
  },
  {
    name: 'travel',
    icon: 'beach',
    color: '#62b26c',
  },
  {
    name: 'food',
    icon: 'food',
    color: '#d39523',
  },
  {
    name: 'shopping',
    icon: 'shopping',
    color: '#af44a1',
  },
  {
    name: 'tips',
    icon: 'coin',
    color: '#308270',
  },
  {
    name: 'transfer',
    icon: 'bank-transfer',
    color: '#774231',
  },
  {
    name: 'other',
    icon: 'cash-usd',
    color: '#a0bf28',
  },
]

export default DefaultCategories

export const CategoryKeys = DefaultCategories.map(c => c.name)
