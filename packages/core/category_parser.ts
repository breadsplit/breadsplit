import Vue from 'vue'
import { Category, Group } from '../types'
import { BuiltInCategories, CategoryPresets } from '../meta/categories'
import { IsThisId } from './id_helper'

export function ParserCategory (cat: Category | string, group: Group, vm: Vue): Category {
  if (cat && typeof cat !== 'string')
    return cat

  let name = cat || 'other'

  let category

  if (IsThisId.Category(name))
    category = (group.categories || []).find(i => typeof i !== 'string' && i.id === name)
  else
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
    text: vm.$t(`cats.${name}.display`).toString(),
  }
}

export function GetCategoriesOfGroup (group: Group, vm: Vue): Category[] {
  const categories = group.categories || CategoryPresets.default

  return categories.map(c => ParserCategory(c, group, vm))
}
