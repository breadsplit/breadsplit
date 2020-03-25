describe('Offline functions', () => {
  it('can be visited', () => {
    cy.visit('/?lang=en')

    cy.title()
      .should('contain', 'BreadSplit')
  })

  it('should popup welcome message', () => {
    cy.get('.welcome-dialog .v-toolbar')
      .should('contain', 'Welcome to BreadSplit')

    cy.get('.welcome-dialog .v-card__actions > .v-btn.primary')
      .click()
  })

  it('can create group', () => {
    cy.contains('new group')
      .click()

    cy.get('.new-group .group-name-input input')
      .type('GroupA')

    cy.get('.new-group .currency-select')
      .should('contain', 'USD')

    cy.get('.button-next')
      .click()

    cy.get('.member-name-input input')
      .type('UserA')
      .type('{enter}')
      .type('UserB')
      .type('{enter}{esc}')

    cy.get('.members-list')
      .should('contain', 'Me')
      .should('contain', 'UserA')
      .should('contain', 'UserB')

    cy.get('.button-create')
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

    cy.get('.new-transaction .member-toggles .selected.member')
      .should('contain', 'Me')

    cy.get('.button-next')
      .click()

    function clickNum(num: number, parent = '') {
      if (num === 0)
        num = 11
      cy.get(`${parent} .soft-numpad > .numbers > :nth-child(${num})`)
        .click()
    }

    function input(num: number, parent = '') {
      num.toString().split('').forEach((c) => {
        if (c === '.')
          clickNum(10, parent)
        else
          clickNum(+c, parent)
      })
    }

    const number = 1230.45
    input(number, '.page-2')

    cy.get('.number-input input')
      .should('have.value', number.toString())

    cy.get('.button-next')
      .click()

    cy.get('.button-next')
      .click()

    cy.get('.description-field input')
      .type('ExpenseA')

    cy.get('.button-next')
      .click()

    cy.get('.balances')
      .should((balances) => {
        expect(balances).to.contain((number / 3).toFixed(2))
      })
  })
})
