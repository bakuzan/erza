const Op = require('sequelize').Op;

const { db } = require('../../connectors');
const { SeasonTypes } = require('../../constants/enums');
const { fmtYYYYMM } = require('./formatDateColumn');

module.exports = function getSeasonalWhereClause(statuses) {
  return {
    status: {
      [Op.in]: statuses
    },
    [Op.or]: [
      { _legacyIsSeason: true },
      {
        [Op.and]: [
          db.where(fmtYYYYMM('start'), {
            [Op.eq]: fmtYYYYMM('series_start')
          }), // start is in same month as series_start
          {
            [Op.or]: [
              db.where(fmtYYYYMM('start'), {
                [Op.ne]: fmtYYYYMM('end')
              }),
              { end: { [Op.eq]: null } }
            ]
          },
          { series_type: { [Op.in]: SeasonTypes } }
        ]
      }
    ]
  };
};
