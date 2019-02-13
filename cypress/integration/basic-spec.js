// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Overmind basics', () => {
  // purely testing if DOM shows results
  it('visits the page', () => {
    cy.visit('/')
    cy.get('.post').should('have.length', 10)
  })
})
