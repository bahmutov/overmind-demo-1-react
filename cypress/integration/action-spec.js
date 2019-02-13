/// <reference types="cypress" />
/// <reference path="./custom-commands.d.ts" />
context('Overmind actions', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('invokes an action', () => {
    cy.overmind()
      .its('actions')
      .invoke('changeShowCount', { target: { value: 20 } })
    cy.get('.post').should('have.length', 20)
    // note that this has not updated the drop down "Show count:"
  })
})
