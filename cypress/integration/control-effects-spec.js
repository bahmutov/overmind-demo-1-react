/// <reference types="Cypress" />
/// <reference path="./custom-commands.d.ts" />

describe('Overmind effects', () => {
  context.skip('cannot set up spying before or after visit', () => {
    // test is skipped on purpose, left just for demo
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

    it('spies on request before visit', () => {
      // cannot set up spying before overmind is created
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
  })

  context('can be set up synchronously', () => {
    it('emits all requests', () => {
      const spy = cy.spy().as('effect')

      Cypress.setOvermind = overmind => {
        overmind.eventHub.on('effect', effect => {
          // we get two events for each effect call
          // first at the start with "isPending: true"
          // and the second after the effect finishes
          if (!effect.isPending) {
            console.log(
              'effect "%s %s" has finished',
              effect.method,
              effect.actionName,
              effect.result
            )
            spy(effect)
          }
        })
        // safe to delete now (optional)
        delete Cypress.setOvermind
      }
      cy.visit('/')
      cy.get('@effect').should('have.been.calledOnce')
    })

    it('can spy on request method in effects', () => {
      Cypress.setOvermind = overmind => {
        cy.spy(overmind.effects, 'request').as('request')
      }
      cy.visit('/')
      cy.get('@request')
        .should('have.been.calledOnce')
        .and(
          'have.been.be.calledWithExactly',
          'https://jsonplaceholder.typicode.com/posts'
        )
    })

    it('can stub the request method in effects', () => {
      cy.fixture('posts').then(posts => {
        Cypress.setOvermind = overmind => {
          cy.stub(overmind.effects, 'request')
            .as('request')
            .resolves(posts)
        }
      })
      cy.visit('/')
      cy.get('@request')
        .should('have.been.calledOnce')
        .and(
          'have.been.be.calledWithExactly',
          'https://jsonplaceholder.typicode.com/posts'
        )
      cy.get('li.post').should('have.length', 2)
    })
  })
})
