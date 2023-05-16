# How To Contribute

## Installation

- `git clone <repository-url>`
- `cd <%= addonName %>`
- `<% if (yarn) { %>yarn<% } else if (pnpm) { %>pnpm<% } else { %>npm<% } %> install`

## Linting

- `<% if (yarn) { %>yarn lint<% } else if (pnpm) { %>pnpm lint<% } else { %>npm run lint<% } %>`
- `<% if (yarn) { %>yarn lint:fix<% } else if (pnpm) { %>pnpm lint:fix<% } else { %>npm run lint:fix<% } %>`

## Building the addon

- `cd <%= addonInfo.location %>`
- `<% if (yarn) { %>yarn<% } else if (pnpm) { %>pnpm<% } else { %>npm<% } %> build`

## Running tests

- `cd <%= testAppInfo.location %>`
- `<% if (yarn) { %>yarn test<% } else if (pnpm) { %>pnpm test<% } else { %>npm run test<% } %>` – Runs the test suite on the current Ember version
- `<% if (yarn) { %>yarn test:watch<% } else if (pnpm) { %>pnpm test:watch<% } else { %>npm run test:watch<% } %>` – Runs the test suite in "watch mode"

## Running the test application

- `cd <%= testAppInfo.location %>`
- `<% if (yarn) { %>yarn start<% } else if (pnpm) { %>pnpm start<% } else { %>npm run start<% } %>`
- Visit the test application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://cli.emberjs.com/release/](https://cli.emberjs.com/release/).
