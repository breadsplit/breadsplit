<template lang='pug'>
app-promise-dialog(ref='dialog' :max-width='400')
  v-card.form-category(v-rows='"max-content max-content auto max-content"')
    app-composed-toolbar.mb-n3(height='130' dark :color='form.color')
      v-btn(icon @click='close()')
        v-icon mdi-close
      v-toolbar-title {{title}}
      v-spacer
      v-btn(icon @click='remove()' v-if='mode === "edit"')
        v-icon mdi-delete
      v-btn(icon @click='submit()' :disabled='!submitable')
        v-icon mdi-check

      template(v-slot:content='')
        .px-6.py-4
          v-text-field.group-name-input.flat.pl-12(
            v-model='form.text'
            :label='$t("ui.category_editing.category_name")'
            :placeholder='$t("ui.category_editing.category_name_placeholder")'
            autofocus
          )

    div
      app-icon-color-select(:icon.sync='form.icon' :color.sync='form.color')
        template(v-slot='{ on }')
          v-btn(fab v-on='on' style='position: absolute; right: 20px; margin-top: -18px; z-index: 20;')
            v-icon(:color='form.color') mdi-{{form.icon}}

    .my-10.py-2
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
import PromiseDialog from '../global/PromiseDialog.vue'
import { Category } from '~/types'
import { CategoryDefault } from '~/core'

@Component
export default class FormCategory extends Vue {
  form: Category = CategoryDefault()
  mode: 'edit' | 'create' = 'create'

  $refs!: {
    dialog: PromiseDialog
  }

  get submitable() {
    return this.form.text && this.form.color && this.form.icon
  }

  async open(category?: Category) {
    if (category && category.id)
      this.mode = 'edit'
    else
      this.mode = 'create'

    this.form = CategoryDefault(category)

    return await this.$refs.dialog.open<Category | undefined>()
  }

  get title() {
    if (this.mode === 'create')
      return this.$t('ui.category_editing.create')
    else
      return this.$t('ui.category_editing.edit')
  }

  submit() {
    if (this.mode === 'create')
      this.$store.dispatch('group/newCategory', { category: this.form })
    else if (this.mode === 'edit')
      this.$store.dispatch('group/editCategory', { categoryid: this.form.id, changes: this.form })
    this.$refs.dialog.close(this.form)
  }

  remove() {
    if (this.mode === 'edit') {
      this.$store.dispatch('group/removeCategory', { categoryid: this.form.id })
      this.$refs.dialog.close(this.form)
    }
  }

  close() {
    this.$refs.dialog.close()
  }
}
</script>
