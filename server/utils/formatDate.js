const { padNumber } = require('./index');

module.exports = {
  formatDateInput(date) {
    if (!date) {
      return date;
    }

    const d = new Date(date);
    const year = d.getFullYear();
    const month = padNumber(d.getMonth() + 1, 2);
    const day = padNumber(d.getDate(), 2);

    return `${year}-${month}-${day}`;
  },
  formatDateTimeInput(date) {
    if (!date) {
      return date;
    }

    return new Date(date).toISOString();
  }
};
