const Common = require('../utils');
const inSeasonCalc = require('../utils/inSeason');

const Query = require('./query');
const Mutation = require('./mutation');

module.exports = {
  Query,
  Mutation,
  // Item resolvers
  Anime: {
    episodes() {
      if (instance.episodes) {
        return instance.episodes;
      }

      return instance.getEpisodes();
    },
    tags(instance) {
      if (instance.tags) {
        return instance.tags;
      }

      return instance.getTags();
    },
    season(instance) {
      const values = instance.get({
        plain: true
      });

      return inSeasonCalc(values);
    }
  },
  Manga: {
    chapters() {
      if (instance.chapters) {
        return instance.chapters;
      }

      return instance.getChapters();
    },
    tags(instance) {
      if (instance.tags) {
        return instance.tags;
      }

      return instance.getTags();
    }
  },
  // History resolvers
  Episode: {
    anime(instance) {
      if (instance.anime) {
        return instance.anime;
      }

      return instance.getAnime();
    },
    date(instance) {
      return Common.getFormattedDateString(instance.date);
    }
  },
  Chapter: {
    manga(instance) {
      if (instance.manga) {
        return instance.manga;
      }

      return instance.getManga();
    },
    date(instance) {
      return Common.getFormattedDateString(instance.date);
    }
  },
  Tag: {}
};
