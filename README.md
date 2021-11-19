# Flexible Finance Server

The backend to [Flexible Finance Client](https://gitlab.com/b2079/flexible-finance-client). Together, they form Flexible Finance, a money management app that aims to support the casual user by providing functionality and flexibility without the intensity of serious accounting apps.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

Make sure you have [PostgreSQL](https://www.postgresql.org/download/) installed.

```sh
# Get the code:
$ git clone https://gitlab.com/b2079/flexible-finance-server.git # or clone your own fork
$ cd flexible-finance-server

# Set up your environment:
$ npm install
$ cp .env.example .env
# Open .env and replace the values in <angle brackets> with your own

# Build and run the app:
$ npm run build
$ npm run start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Development

There is support in the configuration files for automatic linting with Visual Studio Code, with the ESLint and Prettier extensions installed.

## Deploying to Heroku

There is a continuous deployment pipeline between the GitLab repository and the Heroku app. When a commit is pushed to `main`, GitLab will deploy that code to Heroku.

The server app can be viewed at https://flexible-finance-server.herokuapp.com/. The client app can be viewed at https://flexible-finance-client.herokuapp.com/.
