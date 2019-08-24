import Vue from 'vue'
import { Category, Group } from '../types'
import { BuiltInCategories, CategoryPresets } from '../meta/categories'

export function ParseCategory (cat: Category | string | undefined, group: Group, vm: Vue): Category {
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
    text: category.text || vm.$t(`cats.${name}.display`).toString(),
  }
}

export function GetCategoriesOfGroup (group: Group, vm: Vue): Category[] {
  const categories = group.categories || CategoryPresets.default

  return categories.map(c => ParseCategory(c, group, vm)).filter(c => !c.removed)
}
