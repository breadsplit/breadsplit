import { mount } from '@vue/test-utils'
import Confirm from '@/components/Confirm.vue'

describe('Confirm', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Confirm)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
