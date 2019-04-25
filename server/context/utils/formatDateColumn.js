const { db } = require('../../connectors');

module.exports = {
  fmtYYYYMM: (colName) => db.fn('strftime', '%Y-%m', db.col(colName)),
  fmtYYYY: (colName) => db.fn('strftime', '%Y', db.col(colName))
};
