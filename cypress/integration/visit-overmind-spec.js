/// <reference types="cypress" />

Cypress.Commands.add('onOvermind', set => {
  expect(set).to.be.a('function', 'onOvermind expects a callback')

  // prepare for application calling
  // window.overmind = overmind
  // during initialization

  cy.on('window:before:load', win => {
    console.log('prepare overmind setter')
    Object.defineProperty(win, 'overmind', { set })
  })
})

it('catches overmind creation', () => {
  cy.onOvermind(overmind => {
    cy.spy(overmind.effects, 'request').as('request')
  })
  cy.visit('/')
  cy.get('@request').should('have.been.calledOnce')
})

it('stubs request', () => {
  cy.fixture('posts').then(posts => {
    cy.onOvermind(overmind => {
      cy.stub(overmind.effects, 'request')
        .as('request')
        .resolves(posts)
    })
  })
  cy.visit('/')
  cy.get('@request').should('have.been.calledOnce')
})

it('can transform post titles', () => {
  cy.onOvermind(overmind => {
    const originalRequest = overmind.effects.request
    cy.stub(overmind.effects, 'request')
      .as('request')
      .callsFake(url => {
        return originalRequest(url).then(list => {
          list[0].title = 'My mock title'
          return list
        })
      })
  })
  cy.visit('/')
  cy.contains('.post', 'My mock title')
})
