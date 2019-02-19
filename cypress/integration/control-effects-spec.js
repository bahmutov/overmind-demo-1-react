/// <reference types="Cypress" />
/// <reference path="./custom-commands.d.ts" />

describe('Overmind effects', () => {
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

    it('delay the response to effect', () => {
      // there are two posts in the fixture
      cy.fixture('posts').then(posts => {
        // our app will notify us synchronously during load
        // so we can set up spies and stubs
        Cypress.setOvermind = overmind => {
          // when effect.request happens
          // we are going to delay by 2 seconds and respond with our data
          cy.stub(overmind.effects, 'request')
            .as('request')
            .resolves(Cypress.Promise.delay(2000, posts))
        }
      })
      // let's roll
      cy.visit('/')
      // page makes the request right away, nice
      cy.get('@request')
        .should('have.been.calledOnce')
        .and(
          'have.been.be.calledWithExactly',
          'https://jsonplaceholder.typicode.com/posts'
        )
      // while request is in transit, loading state
      cy.contains('Loading')
      cy.overmind()
        .its('state.isLoadingPosts')
        .should('be.true')

      // load should finish eventually
      cy.overmind()
        .its('state.isLoadingPosts')
        .should('be.false')
      cy.contains('Loading').should('not.exist')
      cy.get('li.post').should('have.length', 2)
    })
  })
})
