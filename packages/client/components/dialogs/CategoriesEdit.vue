<template lang='pug'>
v-card.categories-edit
  app-composed-toolbar.mb-n3(dark color='primary')
    v-btn(icon @click='close()')
      v-icon mdi-close
    v-toolbar-title {{$t('ui.category_editing.title')}}
    v-spacer
    v-btn(icon @click='submit()')
      v-icon mdi-check

  draggable.py-6.mt-2(
    v-model='form'
    v-bind='dragOptions'
    @start='onStart'
    @end='onEnd'
  )
    transition-group.pa-3(type='transition', v-columns='`repeat(${columns}, 1fr)`')
      app-category-item(
        @click='edit(cat)'
        v-for='cat in form'
        :key='JSON.stringify(cat)'
        :category='parseCategory(cat)'
        :class='{"op-0": dragging === cat}'
        color
      )

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
import cloneDeep from 'lodash/cloneDeep'
import FormCategory from './FormCategory.vue'
import { CommonMixin, GroupMixin, DialogChildMixin } from '~/mixins'
import { Category } from '~/types'
import { CategoryPresets } from '~/../meta/categories'

@Component({
  components: {
    draggable,
  },
})
export default class CategoriesEdit extends mixins(DialogChildMixin, CommonMixin, GroupMixin) {
  form: (string | Category)[] = []
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

  init () {
    this.form = cloneDeep(this.group.categories || CategoryPresets.default)
      .filter(c => typeof c === 'string' || !c.removed)
  }

  mounted () {
    this.init()
  }

  submit () {
    this.$store.dispatch('group/reorderCategories', { categories: this.form })
    this.close()
  }

  onStart (e) {
    this.drag = true
    this.dragging = this.form[e.oldIndex]
  }

  onEnd (e) {
    this.drag = false
    this.dragging = null
  }

  async edit (cat: string | Category) {
    if (typeof cat === 'string') {
      this.WIP() // TODO:
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
