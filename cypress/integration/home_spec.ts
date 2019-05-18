describe('The Home Page', () => {
  it('Add a group', () => {
    cy.viewport('macbook-13')

    cy.visit('/?locale=en')

    cy.contains('new group').click()

    cy
      .get('.v-card > .container .layout > :nth-child(1) input')
      .type('GroupA')

    cy
      .get('.v-card > .container .layout > :nth-child(2) input')
      .type('twd{enter}')

    cy
      .get('.v-card > .container .layout > :nth-child(3) input')
      .type('UserA')
      .type('{enter}')
      .type('UserB')
      .type('{enter}{esc}')

    cy
      .get('.container .layout > :nth-child(4) > :nth-child(1).v-btn')
      .click()

    cy.wait(500)

    cy.url().should('include', '/group/')

    cy.get('.balances').should((balances) => {
      expect(balances).to.contain('UserA')
      expect(balances).to.contain('UserB')
    })
  })
})
