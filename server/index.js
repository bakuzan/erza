const { ApolloServer } = require('apollo-server-express');

const Constants = require('./constants');
const typeDefs = require('./type-definitions');
const resolvers = require('./resolvers');
const context = require('./context');
const app = require('./app');

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

const GRAPHQL_PATH = '/erz-graphql';
const PORT =
  process.env.NODE_ENV === Constants.environment.production
    ? process.env.PORT
    : process.env.DEV_SERVER_PORT;

server.applyMiddleware({
  app,
  path: GRAPHQL_PATH,
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
