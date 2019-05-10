const { formatDateInput } = require('../../utils/formatDate');

module.exports = async function lastRepeatDate({ key, fn }, inst) {
  if (!inst.isRepeat && inst.timesCompleted === 0) {
    return '';
  }

  let latest = inst[key];

  if (!latest) {
    latest = await inst[fn]({
      raw: true,
      order: [['date', 'DESC']],
      limit: 1
    });
  }

  const [recent] = latest;
  return recent ? formatDateInput(recent.date) : '';
};
