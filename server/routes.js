const chalk = require('chalk');
const cors = require('cors');
const proxy = require('express-http-proxy');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise is deprecated...so use native.

const GraphqlSchema = require('./graphql/schema.js');

const statistics = require('./statistics/index.js');
const malSearch = require('./myanimelist/mal-search.js');
const imageStore = require('./image-store/index.js');
const Constants = require('./constants');

// db
const environment = process.env.NODE_ENV || Constants.environment.development;
const db = mongoose.connect(
  `mongodb://localhost/${Constants.appName}-${environment}`,
  { useMongoClient: true },
  (err) => {
    if (!err) {
      return console.log(
        chalk.magenta.bold(`Connected to ${Constants.appName}-${environment}`)
      );
    }

    console.error(
      chalk.bgRed.white.bold(
        `Could not connect to ${Constants.appName}-${environment}!`
      )
    );
    console.log(chalk.bgRed.white.bold(err));
  }
);

const router = express.Router();
router.use(cors());

//Mal route
router.get('/api/mal-search/:type', malSearch);

//Imgur routes
router.post('/api/image-upload/url', imageStore.upload);
router.post('/api/image-upload/file', imageStore.uploadFromLocal);

//Statistic routes
router.get(
  '/api/statistics/status-counts/:type/:isAdult',
  statistics.getStatusCounts
);
router.get(
  '/api/statistics/rating-counts/:type/:isAdult',
  statistics.getRatingCounts
);
router.get(
  '/api/statistics/history-counts/:type/:isAdult/:breakdown',
  statistics.getHistoryCounts
);
router.get(
  '/api/statistics/history-detail/:type/:isAdult/:breakdown/:partition',
  statistics.getHistoryCountsPartition
);
router.get(
  '/api/statistics/history-years/:type/:isAdult/:breakdown/:partition',
  statistics.getHistoryCountsByYearsPartition
);

// Yoruichi Route
router.post('/yri-graphql', proxy('http://localhost:9933/yri-graphql'));

// Graphql route
router.use(
  '/graphql',
  graphqlHTTP({
    schema: GraphqlSchema,
    graphiql: true,
    pretty: true
  })
);

module.exports = router;
