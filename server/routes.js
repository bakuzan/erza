const chalk = require('chalk');
const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise is deprecated...so use native.
const graffiti = require('@risingstack/graffiti');

const GraphqlSchema = require('./graphql/schema.js');

const statistics = require('./statistics/index.js');
const malSearch = require('./myanimelist/mal-search.js');
const imageStore = require('./image-store/index.js');
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

//Mal route
router.get('/api/mal-search/:type', malSearch);

//Imgur routes
router.post('/api/image-upload/url', imageStore.upload);
router.post('/api/image-upload/file', imageStore.uploadFromLocal);

//Statistic routes
router.get('/api/statistics/status-counts/:type/:isAdult', statistics.getStatusCounts);
router.get('/api/statistics/rating-counts/:type/:isAdult', statistics.getRatingCounts);
router.get('/api/statistics/history-counts/:type/:isAdult/:breakdown', statistics.getHistoryCounts);
router.get('/api/statistics/history-detail/:type/:isAdult/:breakdown/:partition', statistics.getHistoryCountsPartition);
router.get('/api/statistics/history-years/:type/:isAdult/:breakdown/:partition', statistics.getHistoryCountsByYearsPartition);

// Graphql route
router.use(
  graffiti.express({
    schema: GraphqlSchema,
    graphiql: true,
    pretty: true
  })
);

module.exports = router;
