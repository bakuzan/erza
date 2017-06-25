const chalk = require('chalk');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise is deprecated...so use native.
const graffiti = require('@risingstack/graffiti');
const GraphqlSchema = require('./graphql/schema.js');

const malSearch = require('./myanimelist/mal-search.js');
const Constants = require('./constants');

// db
const environment = process.env.NODE_ENV || 'development';
const db = mongoose.connect(`mongodb://localhost/${Constants.appName}-${environment}`, (err) => {
	if (err) {
		console.error(chalk.bgRed.white.bold('Could not connect to MongoDB!'));
		console.log(chalk.bgRed.white.bold(err));
	}
});

const router = express.Router();

// middleware to use for all requests
router.use((req, res, next) => {
	console.log(chalk.bold.yellow('Query @ ', req.url));
	next(); // pass to next handler.
});

//Mal route
router.get('/api/mal-search/:type', malSearch);

// Graphql route
router.use(
  graffiti.express({
    schema: GraphqlSchema,
    graphiql: true,
    pretty: true
  })
);

module.exports = router;
