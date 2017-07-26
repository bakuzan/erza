const chalk = require('chalk');
const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise is deprecated...so use native.
const graffiti = require('@risingstack/graffiti');
const GraphqlSchema = require('./graphql/schema.js');

const statistics = require('/statistics/index.js');
const malSearch = require('./myanimelist/mal-search.js');
const Constants = require('./constants');

// db
const environment = process.env.NODE_ENV || Constants.environment.development;
const db = mongoose.connect(`mongodb://localhost/${Constants.appName}-${environment}`, (err) => {
	if (!err) return console.log(chalk.magenta.bold(`Connected to ${Constants.appName}-${environment}`));
  console.error(chalk.bgRed.white.bold(`Could not connect to ${Constants.appName}-${environment}!`));
  console.log(chalk.bgRed.white.bold(err));
});

const router = express.Router();
router.use(cors());

// middleware to use for all requests
router.use((req, res, next) => {
	console.log(chalk.bold.yellow('Query @ ', req.url));
	next(); // pass to next handler.
});

//Mal route
router.get('/api/mal-search/:type', malSearch);

//Statistic routes
router.get('/api/statistics/status-counts/:type/:isAdult', statistics.getStatusCounts);
router.get('/api/statistics/rating-counts/:type/:isAdult', statistics.getRatingCounts);

// Graphql route
router.use(
  graffiti.express({
    schema: GraphqlSchema,
    graphiql: true,
    pretty: true
  })
);

module.exports = router;
