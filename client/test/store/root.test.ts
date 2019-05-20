import { mutations, getters, RootStateDefault } from '~/store'

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
