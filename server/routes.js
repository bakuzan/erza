const chalk = require('chalk');
const proxy = require('express-http-proxy');
const express = require('express');

// const statistics = require('./statistics/index.js');
const imageStore = require('./image-store/index.js');
const Constants = require('./constants');

// db
const environment = process.env.NODE_ENV || Constants.environment.development;
const router = express.Router();

//Imgur routes
router.post('/api/image-upload/url', imageStore.upload);
router.post('/api/image-upload/file', imageStore.uploadFromLocal);

//Statistic routes
// router.get(
//   '/api/statistics/status-counts/:type/:isAdult',
//   statistics.getStatusCounts
// );
// router.get(
//   '/api/statistics/rating-counts/:type/:isAdult',
//   statistics.getRatingCounts
// );
// router.get(
//   '/api/statistics/history-counts/:type/:isAdult/:breakdown',
//   statistics.getHistoryCounts
// );
// router.get(
//   '/api/statistics/history-detail/:type/:isAdult/:breakdown/:partition',
//   statistics.getHistoryCountsPartition
// );
// router.get(
//   '/api/statistics/history-years/:type/:isAdult/:breakdown/:partition',
//   statistics.getHistoryCountsByYearsPartition
// );

// Yoruichi Route
router.post('/yri-graphql', proxy('http://localhost:9933/yri-graphql'));

module.exports = router;
