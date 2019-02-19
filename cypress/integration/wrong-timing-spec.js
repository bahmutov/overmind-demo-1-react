/// <reference types="Cypress" />
/// <reference path="./custom-commands.d.ts" />

describe('Overmind effects', () => {
  // tests are skipped on purpose, they are left just for demo

  context.skip('cannot set up spying before or after visit', () => {
    it('spies on request before visit', () => {
      // cannot set up spying BEFORE overmind is created
      // or even cannot use async polling - because we might miss the beat
      // between creating overmind and executing the very first effect
      cy.overmind()
        .its('effects')
        .then(effects => {
          cy.spy(effects, 'request').as('request')
        })
      cy.visit('/')
      cy.get('@request').should('have.been.calledOnce')
    })

    it('spies on request effect after visit', () => {
      cy.visit('/')
      // sets the spy TOO LATE
      // because the app makes the request at the very start
      cy.overmind()
        .its('effects')
        .then(effects => {
          cy.spy(effects, 'request').as('request')
        })
      // this fails because the effect was called before we started spying
      cy.get('@request').should('have.been.calledOnce')
    })
  })
})
