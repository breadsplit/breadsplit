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
    color: '#d68822',
  },
  {
    name: 'transfer',
    icon: 'bank-transfer',
    color: '#a963d8',
  },
  {
    name: 'other',
    icon: 'help-rhombus-outline',
    color: '#9e9589',
  },
]

export default DefaultCategories

export const CategoryKeys = DefaultCategories.map(c => c.name)
