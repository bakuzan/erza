const Op = require('sequelize').Op;

const { db } = require('../../connectors');
const { Status, SeasonTypes } = require('../../constants/enums');

const isMonthBreakdown = require('./isMonthBreakdown');
const fmtYYYYMM = require('./formatDateColumn');
const coalesceSeasonCounts = require('./coalesceSeasonCounts');

module.exports = function getBreakdownSettings(v) {
  const isMonth = isMonthBreakdown(v);

  return {
    isMonth,
    mapper: isMonth ? (d) => d : coalesceSeasonCounts,
    grouping: isMonth ? 'end' : 'start',
    where: isMonth
      ? { status: Status.Completed }
      : {
          status: {
            [Op.in]: [Status.Ongoing, Status.Completed]
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
        }
  };
};
