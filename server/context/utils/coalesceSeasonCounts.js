const { getSeasonStartMonth } = require('../../utils/getSeasonStartMonth');

const aggregateIsSeasonStart = (o) =>
  ['01', '04', '07', '10'].some((y) => y === o.key.split('-')[1]);

module.exports = function coalesceSeasonCounts(data) {
  const invalidSeasonStarts = data
    .filter((x) => !aggregateIsSeasonStart(x))
    .reduce((p, c) => [...p, [c.key, c.value]], []);

  if (!invalidSeasonStarts.length) {
    return data;
  }

  const validSeasonStarts = data.filter(aggregateIsSeasonStart);

  return invalidSeasonStarts.reduce((p, [monthKey, monthValue]) => {
    const dateString = new Date(monthKey).toISOString();
    const { year, season: seasonMonth } = getSeasonStartMonth(dateString);
    const seasonText = `${year}-${seasonMonth}`;
    const index = p.findIndex((x) => x.key === seasonText);

    if (index === -1) {
      return [...p, { key: seasonText, value: monthValue }];
    }

    const season = p[index];

    return Object.assign([...p], {
      [index]: { key: season.key, value: season.value + monthValue }
    });
  }, validSeasonStarts);
};
