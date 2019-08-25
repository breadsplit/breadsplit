import { Category, Group } from '../types'
import { BuiltInCategories, CategoryPresets } from '../meta/categories'
import { Translator } from '../utils'

export function ParseCategory (cat: Category | string | undefined, group: Group, t: Translator, locale?: string): Category {
  if (cat && typeof cat !== 'string')
    return cat

  let name = cat || 'other'

  let category

  category = (group.categories || []).find(i => typeof i !== 'string' && i.id === name)

  if (!category)
    // @ts-ignore
    category = BuiltInCategories[name]

  // fallback
  if (!category) {
    name = 'unknown'
    category = BuiltInCategories.unknown
  }

  return {
    id: name,
    color: category.color,
    icon: category.icon,
    text: category.text || t(`cats.${name}.display`).toString(),
  }
}

export function GetCategoriesOfGroup (group: Group, t: Translator, locale?: string): Category[] {
  const categories = group.categories || CategoryPresets.default

  return categories.map(c => ParseCategory(c, group, t, locale)).filter(c => !c.removed)
}
