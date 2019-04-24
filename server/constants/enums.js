const StatTypes = ['Anime', 'Manga'];
const StatBreakdowns = ['Month', 'Season'];

function mapEnumArrayToObject(arr) {
  return arr.reduce((p, k) => ({ ...p, [k]: k }), {});
}

module.exports = {
  StatTypes,
  StatType: mapEnumArrayToObject(StatTypes),
  StatBreakdowns,
  StatBreakdown: mapEnumArrayToObject(StatBreakdowns)
};
