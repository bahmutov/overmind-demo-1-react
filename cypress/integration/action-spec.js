/// <reference types="cypress" />
/// <reference path="./custom-commands.d.ts" />
context('Overmind actions', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('invokes an action', () => {
    cy.get('.post').should('have.length', 10)
    cy.wait(1000) // for dramatic effect
    cy.overmind()
      .its('actions')
      .invoke('changeShowCount', { target: { value: 50 } })
    cy.get('.post').should('have.length', 50)
  })
})
