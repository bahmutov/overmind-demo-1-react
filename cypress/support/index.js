// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// adds custom command to return "window.overmind"
Cypress.Commands.add('overmind', () => {
  let overmind

  const cmd = Cypress.log({
    name: 'overmind',
    consoleProps () {
      return {
        Overmind: overmind
      }
    }
  })

  return (
    cy
      .window({ log: false })
      // instead of .its('overmind') that always logs to the console
      // use ".then" shortcut (but without retry)
      .then({ log: false }, win => {
        overmind = win.overmind
        cmd.end()
        return overmind
      })
  )
})
