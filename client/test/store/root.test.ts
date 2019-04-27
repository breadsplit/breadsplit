import { mutations, getters } from '~/store/index'
import { RootStateDefault, GroupStateDefault, GroupDefault } from '~/utils/defaults'

describe('root state mutations', () => {
  it('switchLocale', () => {
    const state = RootStateDefault()
    expect(state.user_locale).toBeFalsy()
    mutations.switchLocale(state, 'zh-tw')
    expect(state.user_locale).toEqual('zh-tw')

    expect(state.browser_locale).toEqual('en')
    mutations.browserLocale(state, 'zh-tw')
    expect(state.browser_locale).toEqual('zh-tw')
  })

  it('loaded', () => {
    const state = RootStateDefault()
    expect(state.loaded).toBeFalsy()
    mutations.loaded(state, undefined)
    expect(state.loaded).toBeTruthy()
    // "loaded" should ignore parameters
    mutations.loaded(state, false)
    expect(state.loaded).toBeTruthy()
  })
})

describe('root state getters', () => {
  it('locale', () => {
    const state = RootStateDefault()
    expect(getters.locale(state, undefined, state, undefined)).toEqual('en')
    mutations.browserLocale(state, 'zh-cn')
    expect(getters.locale(state, undefined, state, undefined)).toEqual('zh-cn')
    mutations.switchLocale(state, 'zh-tw')
    expect(getters.locale(state, undefined, state, undefined)).toEqual('zh-tw')
  })
})
