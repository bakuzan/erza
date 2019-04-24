const chalk = require('chalk');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const Constants = require('./constants');
const typeDefs = require('./type-definitions');
const resolvers = require('./resolvers');
const context = require('./context');
const defaultErrorHandler = require('./utils/defaultErrorHandler');

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ ...context }),
  introspection: true,
  playground: {
    settings: {
      'editor.cursorShape': 'block',
      'editor.fontSize': 16,
      'editor.fontFamily': '"Lucida Console", Consolas, monospace',
      'editor.theme': 'light'
    }
  },
  formatError: (error) => {
    console.log(error);
    return error;
  }
});

// Overide origin if it doesn't exist
app.use(function(req, _, next) {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
});

// Serve static assets
app.use(
  `/${Constants.appName}`,
  express.static(path.resolve(__dirname, '..', 'build'))
);

// Routes
app.use(require('./routes'));

// Non-route handlers
app.use(defaultErrorHandler);

if (process.env.NODE_ENV === Constants.environment.production) {
  app.get('*', (req, res) => {
    if (req.url.includes('graphql')) {
      next();
    }

    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
}

const PORT =
  process.env.NODE_ENV === Constants.environment.production
    ? process.env.PORT
    : process.env.DEV_SERVER_PORT;

server.applyMiddleware({
  app,
  cors: {
    origin: function(origin, callback) {
      if (Constants.whitelist.test(origin)) {
        callback(null, true);
      } else {
        console.log(chalk.red(`Origin: ${origin}, not allowed by CORS`));
        callback(new Error('Not allowed by CORS'));
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
