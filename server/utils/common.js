
const getDateParts = (date) => {
  const d = new Date(date);
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    date: d.getDate()
  };
}

const getSeasonText = (month) => {
  return month === 0 ? 'Winter' :
         month === 3 ? 'Spring' :
         month === 6 ? 'Summer' :
         month === 9 ? 'Fall'   :
         null;
}

const Common = {
  getDateParts
}

module.exports = Common;
