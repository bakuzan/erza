const { db } = require('../../connectors');

module.exports = (colName) => db.fn('strftime', '%Y-%m', db.col(colName));
