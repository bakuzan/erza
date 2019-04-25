const Op = require('sequelize').Op;

const { db } = require('../../connectors');
const { Status, SeasonTypes } = require('../../constants/enums');
const { StatBreakdown } = require('../../constants/enums');
const fmtYYYYMM = require('./formatDateColumn');

const isMonthBreakdown = (val) => val === StatBreakdown.Month;

module.exports = function getBreakdownSettings(v) {
  const isMonth = isMonthBreakdown(v);

  return {
    isMonth,
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
                db.where(fmtYYYYMM('start'), {
                  [Op.ne]: fmtYYYYMM('end')
                }), // start not in same month as end
                { series_type: { [Op.in]: SeasonTypes } }
              ]
            }
          ]
        }
  };
};
