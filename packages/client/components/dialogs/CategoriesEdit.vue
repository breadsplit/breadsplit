<template lang='pug'>
v-card.categories-edit
  app-composed-toolbar.mb-n3(dark color='primary')
    v-btn(icon @click='close()')
      v-icon mdi-close
    v-toolbar-title {{$t('ui.category_editing.title')}}
    v-spacer
    v-btn(icon @click='submit()')
      v-icon mdi-check

  .mt-8

  v-subheader.ml-3 {{$t('ui.category_editing.enabled')}}

  draggable(
    v-model='form'
    v-bind='dragOptions'
    @start='e=>onStart(e, "form")'
    @end='onEnd'
  )
    transition-group.px-3(type='transition', v-columns='`repeat(${columns}, 1fr)`')
      app-category-item.py-4(
        @click.native='edit(cat)'
        v-for='cat in form'
        :key='JSON.stringify(cat)'
        :category='parseCategory(cat)'
        :class='{"op-0": isDragging(cat)}'
        color
      )

  v-subheader.ml-3 {{$t('ui.category_editing.hidden')}}

  draggable(
    v-model='archived'
    v-bind='dragOptions'
    @start='e=>onStart(e, "archived")'
    @end='onEnd'
  )
    transition-group.px-3(type='transition', v-columns='`repeat(${columns}, 1fr)`')
      app-category-item.py-4(
        @click.native='edit(cat)'
        v-for='cat in archived'
        :key='JSON.stringify(cat)'
        :category='parseCategory(cat)'
        :class='{"op-0": isDragging(cat)}'
        color
      )

  .py-4

  .text-center
    span.op-50 {{$t('ui.category_editing.tips')}}

  .py-3

  v-btn(fab color='primary' @click='add' absolute right bottom style='bottom: 18px')
    v-icon mdi-plus

  app-form-category(ref='dialog')
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import FormCategory from './FormCategory.vue'
import { CommonMixin, GroupMixin, DialogChildMixin } from '~/mixins'
import { Category } from '~/types'
import { CategoryPresets, BuiltInCategoriesKeys } from '~/../meta/categories'

@Component({
  components: {
    draggable,
  },
})
export default class CategoriesEdit extends mixins(DialogChildMixin, CommonMixin, GroupMixin) {
  form: (string | Category)[] = []
  archived: (string | Category)[] = []
  columns = 5

  drag = false
  dragging: string | Category | null = null
  dragOptions= {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost',
  }

  $refs!: {
    dialog: FormCategory
  }

  get rawCategories () {
    return this.group.categories || CategoryPresets.default
  }

  get selectedBuiltinCategories () {
    return this.rawCategories.filter(i => typeof i === 'string') as string[]
  }

  get unSelectedBuiltinCategories () {
    return BuiltInCategoriesKeys.filter(i => !this.selectedBuiltinCategories.includes(i))
  }

  init () {
    this.form = this.rawCategories.filter(c => typeof c === 'string' || !c.removed)
    this.archived = [
      ...this.unSelectedBuiltinCategories,
      ...this.rawCategories.filter(c => typeof c !== 'string' && c.removed),
    ]
  }

  mounted () {
    this.init()
  }

  submit () {
    this.$store.dispatch('group/reorderCategories', { categories: this.form, archived: this.archived })
    this.close()
  }

  isDragging (cat: string|Category) {
    if (!this.dragging)
      return false
    if (cat === this.dragging)
      return true
    if (typeof this.dragging !== 'string' && typeof cat !== 'string')
      return this.dragging.id === cat.id
    return false
  }

  onStart (e, source) {
    console.log(e)
    this.drag = true
    if (source === 'form')
      this.dragging = this.form[e.oldIndex]
    else
      this.dragging = this.archived[e.oldIndex]
  }

  onEnd (e) {
    this.drag = false
    this.dragging = null
  }

  async edit (cat: string | Category) {
    if (typeof cat === 'string') {
      // this.WIP() // TODO:
    }
    else {
      const category = await this.$refs.dialog.open(cat)
      if (category)
        this.init()
    }
  }

  async add () {
    const category = await this.$refs.dialog.open()
    if (category)
      this.form.push(category)
  }
}
</script>
