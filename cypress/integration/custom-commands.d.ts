/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    // TODO: change to return chainable with Overmind subject
    overmind(): Chainable<any>
  }
}
