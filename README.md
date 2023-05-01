# Flexible Finance Server

The backend to [Flexible Finance App](https://gitlab.com/b2079/flexible-finance-app). Together, they form Flexible Finance, a money management app that aims to support the casual user by providing functionality and flexibility without the intensity of serious accounting apps.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

Make sure you have [PostgreSQL](https://www.postgresql.org/download/) installed.

_Create a database for this app:_

```sh
createdb flexible-finance-server
# Undo
# dropdb flexible-finance-server
```

If you're using macOS and `createdb` is not found, make sure you've [configured $PATH](https://postgresapp.com/documentation/cli-tools.html)

_Get the code:_

```sh
$ git clone https://gitlab.com/b2079/flexible-finance-server.git # or clone your own fork
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

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Development

There is support in the configuration files for automatic linting with Visual Studio Code, with the ESLint and Prettier extensions installed.

## Deploying to Heroku

There is a continuous deployment pipeline between the GitLab repository and the Heroku app. When a commit is pushed to `main`, GitLab will deploy that code to Heroku.

The server app can be viewed at https://flexible-finance-server.herokuapp.com/. The client app can be viewed at https://flexible-finance-app.herokuapp.com/.

## API Documentation

The documentation for the public API for this server can be viewed at https://flexible-finance-server.herokuapp.com/v1/api-docs (or https://localhost:5000/v1/api-docs if running locally).
