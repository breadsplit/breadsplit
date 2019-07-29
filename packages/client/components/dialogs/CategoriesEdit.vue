<template lang='pug'>
v-card.categories-edit(v-rows='"max-content max-content auto max-content"')
  app-composed-toolbar.mb-n3(dark color='primary')
    v-btn(icon @click='close()')
      v-icon mdi-close
    v-toolbar-title {{$t('ui.categories')}}
    v-spacer

  draggable.my-6(
    v-model='form'
    v-bind='dragOptions'
    @start='onStart'
    @end='onEnd'
  )
    transition-group.pa-3(type='transition', v-columns='`repeat(${columns}, 1fr)`')
      app-category-item(
        @click='onClick'
        v-for='cat in form'
        :key='cat'
        :category='parseCategory(cat)'
        :class='{"op-0": dragging === cat}'
        color
      )

  v-btn(@click='submit', large) Submit
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import cloneDeep from 'lodash/cloneDeep'
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

  init () {
    this.form = cloneDeep(this.group.categories || CategoryPresets.default)
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

  onClick (e) {
    console.log(e)
  }
}
</script>
