const invalidParitionMessage =
  "Invalid parition value. Must be of the form 'YYYY' or 'YYYY-MM'";

module.exports = function validateHistoryPartition(value) {
  if (!value || typeof value !== 'string') {
    throw new Error(invalidParitionMessage);
  }

  const d = new Date(value);

  if (d === 'Invalid Date') {
    throw new Error(invalidParitionMessage);
  }

  if (d.getDate() !== 1) {
    throw new Error(invalidParitionMessage);
  }

  return value;
};
