# Flexible Finance Server

The back-end to [Flexible Finance App](https://github.com/FlexibleFinances/flexible-finance-app). Together, they form Flexible Finance, a bookkeeping app that aims to support the casual user by providing functionality and flexibility without the intensity of serious accounting apps.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

Make sure you have [Postgres](https://www.postgresql.org/download/) installed.

_Create a database for this app:_

```sh
createdb flexible-finance-server
# Undo
# dropdb flexible-finance-server
```

If you're using macOS and `createdb` is not found, make sure you've [configured $PATH](https://postgresapp.com/documentation/cli-tools.html)

_Get the code:_

```sh
$ git clone https://github.com/FlexibleFinances/flexible-finance-server.git # or clone your own fork
$ cd flexible-finance-server
```

_Set up your environment:_

```sh
$ npm install
$ cp .env.example .env
# Open .env and replace the values in <angle brackets> with your own
```

_Build and run the app:_

```sh
$ npm run build
$ npm run start
```

Your app should now be running on [localhost:5001](http://localhost:5001/).

## Development

There is support in the configuration files for automatic linting with Visual Studio Code, with the ESLint and Prettier extensions installed.

## Deploying to Heroku

There is a continuous deployment pipeline between the Github repository and Fly.io. When a commit is pushed to `main`, Github will deploy that code to the demo site on Fly.io, https://flexible-finance-server.fly.dev/.

## API Documentation

The server's API documentation can be viewed on the demo site at https://flexible-finance-server.fly.dev/v1/api-docs/ (or http://localhost:5001/v1/api-docs if running locally).
