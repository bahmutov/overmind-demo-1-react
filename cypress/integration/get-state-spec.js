/// <reference types="cypress" />
/// <reference path="./custom-commands.d.ts" />
context('Overmind', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('checks values in state object', function () {
    cy.get('.post').should('have.length', 10)
    cy.overmind()
      .its('state.showCount')
      .should('equal', '10')

    cy.get('#select-count').select('50')
    cy.get('.post').should('have.length', 50)
    cy.overmind()
      .its('state.showCount')
      .should('equal', '50')
  })
})
