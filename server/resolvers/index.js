const Common = require('../utils');
const inSeasonCalc = require('../models/shared/in-season');

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
    dateStr(instance) {
      return Common.getFormattedDateString(instance.date);
    }
  },
  Chapter: {
    dateStr(instance) {
      return Common.getFormattedDateString(instance.date);
    }
  },
  Tag: {}
};
