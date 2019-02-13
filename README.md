# overmind-demo-1-react [![CircleCI](https://circleci.com/gh/bahmutov/overmind-demo-1-react.svg?style=svg)](https://circleci.com/gh/bahmutov/overmind-demo-1-react) [![renovate-app badge][renovate-badge]][renovate-app]

> Overmind.js state management working with Cypress.io tests

- [overmind.js](https://www.overmindjs.org)
- [Cypress.io](https://www.cypress.io)

This experiment is an extension of [App Actions](https://www.cypress.io/blog/2019/01/03/stop-using-page-objects-and-start-using-app-actions/) approach for writing end-to-end tests. Overmind is making it _extremely_ easy to control / spy / stub anything going on inside the application's state.

## Install and run

```sh
npm ci
npm start
# from another terminal
npx cypress open
```

## Examples

- [get-state-spec.js](cypress/integration/get-state-spec.js) makes assertions against data in the state object
- [action-spec.js](cypress/integration/action-spec.js) drives app by invoking actions
- [control-effects-spec.js](cypress/integration/control-effects-spec.js) spies and stubs external effects from the application, like making `fetch` to the outside API

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
