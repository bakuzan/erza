const chalk = require('chalk');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise is deprecated...so use native.
const graffiti = require('@risingstack/graffiti');
const {getSchema} = require('@risingstack/graffiti-mongoose');

const Constants = require('./constants');

// schema
const Anime = require('./models/anime.js');
const Episode = require('./models/episode.js');
const Tag = require('./models/tag.js');

// db
const environment = process.env.NODE_ENV || 'development';
const db = mongoose.connect(`mongodb://localhost/${Constants.appName}-${environment}`, (err) => {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

const router = express.Router();

// middleware to use for all requests
router.use((req, res, next) => {
	console.log(chalk.bold.yellow('Query @ ', req.url));
	next(); // pass to next handler.
});

// Graphql route
router.use(
  graffiti.express({
    schema: getSchema([Anime, Episode, Tag]),
    graphiql: true,
    pretty: true,
    extensions: ({ document, variables, operationName, result }) => ({ requestAt: Date.now() }),
    formatError: error => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack,
      path: error.path
    })
  })
);

module.exports = router;
