// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Overmind', () => {
  beforeEach(() => {
    // cy.visit('/')
    // cy.get('.post').should('have.length', 10)
  })

  const getOvermind = () => cy.window().its('overmind')

  it('shows 10 posts and can change to 50', function () {
    cy.get('.post').should('have.length', 10)
    getOvermind()
      .its('state.showCount')
      .should('equal', '10')

    cy.get('#select-count').select('50')
    cy.get('.post').should('have.length', 50)
    getOvermind()
      .its('state.showCount')
      .should('equal', '50')

    // drive app via overmind action
  })

  it('drives app via overmind action', () => {
    getOvermind()
      .its('actions')
      .invoke('changeShowCount', { target: { value: 20 } })
    cy.get('.post').should('have.length', 20)
  })

  it('signals "initialized"', () => {
    getOvermind().then(overmind => {
      return cy
        .wrap(overmind.initialized)
        .then(cy.spy().as('overmind initialized'))
    })

    cy.get('@overmind initialized').should('have.been.calledOnce')
  })

  it.skip('calls request effect', () => {
    cy.get('.post').should('have.length', 10)
    getOvermind()
      .its('effects')
      .then(effects => {
        cy.spy(effects, 'request')
      })
    cy.get('#select-count').select('50')
  })

  it('emits on request', () => {
    cy.on('overmind:effects:request', cy.spy().as('overmind request'))
    cy.visit('/')
    cy.get('@overmind request')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', 'https://jsonplaceholder.typicode.com/posts')
  })

  it.only('emits all requests', () => {
    // cy.on('overmind:effects:request', cy.spy().as('overmind request'))

    cy.setOvermind = overmind => {
      console.log('setting overmind', overmind)
      overmind.eventHub.on('effect', cy.spy().as('effect'))
    }
    cy.visit('/')

    // getOvermind()
    //   .its('eventHub')
    //   .then(hub => {
    //     console.log(hub)
    //     debugger
    //   })
    // cy.get('@overmind request')
    //   .should('have.been.calledOnce')
    //   .and('have.been.calledWith', 'https://jsonplaceholder.typicode.com/posts')
  })

  // more examples
  //
  // https://github.com/cypress-io/cypress-example-todomvc
  // https://github.com/cypress-io/cypress-example-kitchensink
  // https://on.cypress.io/writing-your-first-test
})
