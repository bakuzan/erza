const Common = require('../utils');
const inSeasonCalc = require('../utils/inSeason');

const Query = require('./query');
const Mutation = require('./mutation');

module.exports = {
  Query,
  Mutation,
  // Item resolvers
  Anime: {
    season(instance) {
      const values = instance.get({
        plain: true
      });

      return inSeasonCalc(values);
    }
  },
  Manga: {},
  // History resolvers
  Episode: {
    date(instance) {
      return Common.getFormattedDateString(instance.date);
    }
  },
  Chapter: {
    date(instance) {
      return Common.getFormattedDateString(instance.date);
    }
  },
  Tag: {}
};
