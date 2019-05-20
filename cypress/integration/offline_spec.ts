describe('Offline functions', () => {
  it('can be visited', () => {
    cy.visit('/?lang=en')

    cy.title()
      .should('contain', 'BreadSplit')
  })

  it('should popup welcome message', () => {
    cy.get('.init-page .v-toolbar__title')
      .should('contain', 'Welcome to BreadSplit')

    cy.get('.init-page .v-card__actions > .v-btn.primary')
      .click()
  })

  it('can create group', () => {
    cy.contains('new group')
      .click()

    cy.get('.new-group .layout > :nth-child(1) input')
      .type('GroupA')

    cy.get('.new-group .layout > :nth-child(2) input')
      .type('twd{enter}')

    cy.get('.new-group .layout > :nth-child(3) input')
      .type('UserA')
      .type('{enter}')
      .type('UserB')
      .type('{enter}{esc}')

    cy.get('.new-group .layout > :nth-child(4) > :nth-child(1).v-btn')
      .click()

    cy.wait(500)

    cy.url()
      .should('include', '/group/')

    cy.title()
      .should('contain', 'GroupA')

    cy.get('.balances')
      .should((balances) => {
        expect(balances).to.contain('UserA')
        expect(balances).to.contain('UserB')
        expect(balances).to.contain('Me')
      })
  })

  it('can create expense', () => {
    cy.get('.new-transaction-button')
      .click()

    cy.get('.new-transaction .member-select')
      .click()

    cy.get('.v-menu__content .user-avatar')
      .eq(1)
      .click()

    cy.get('.new-transaction .member-select')
      .should('contain', 'UserB')

    function clickNum(num: number) {
      if (num === 0)
        num = 11
      cy.get(`.soft-numpad > .numbers > :nth-child(${num})`)
        .click()
    }

    function input(num: number) {
      num.toString().split('').forEach((c) => {
        if (c === '.')
          clickNum(10)
        else
          clickNum(+c)
      })
    }

    cy.get('.new-transaction .member-select')

    const number = 1230.45
    input(number)

    cy.get('.number-input input')
      .should('have.value', number.toString())

    cy.get('.button-next-step')
      .click()

    cy.get('.description-field input')
      .type('ExpenseA')

    cy.get('.button-save')
      .click()

    cy.get('.balances')
      .should((balances) => {
        expect(balances).to.contain((number / 3).toFixed(2))
      })
  })
})
