function setTime(date, h, m, s, n) {
  const d = new Date(date);
  d.setHours(h, m, s, n);
  return d;
}

function startOfDay(d) {
  return setTime(d, 0, 0, 0, 0);
}

function endOfDay(d) {
  return setTime(d, 23, 59, 59, 999);
}

module.exports = function dateRange(from, to) {
  if (!from) {
    throw new Error('From date is required for date range');
  }

  const f = startOfDay(new Date(from));
  const t = endOfDay(new Date(to || new Date()));

  if (f > t) {
    throw new Error(
      `From date (${f.toISOString()}) is after the To date (${t.toISOString()})`
    );
  }

  return [f, t];
};
