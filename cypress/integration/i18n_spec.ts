describe('i18n Support', () => {
  it('English', () => {
    cy.visit('/?lang=en')

    cy.title()
      .should('equal', 'BreadSplit')
  })

  it('繁體中文', () => {
    cy.visit('/?lang=zh-tw')

    cy.title()
      .should('equal', '分帳吐司')
  })

  it('简体中文', () => {
    cy.visit('/?lang=zh-cn')

    cy.title()
      .should('equal', '分账吐司')
  })
})
