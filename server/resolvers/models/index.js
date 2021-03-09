const { resolveSorting } = require('../../utils');
const { formatDate } = require('../../utils/formatDate');
const inSeasonCalc = require('../../utils/inSeason');

const TodoTemplateResolvers = require('./todoTemplate');
const TodoInstanceResolvers = require('./todoInstance');
const common = require('./common');

module.exports = {
  Anime: {
    ...common.Series,
    episodes(inst) {
      if (inst.episodes) {
        return inst.episodes;
      }

      return inst.getEpisodes();
    },
    season(inst) {
      const values = inst.get({
        plain: true
      });

      return inSeasonCalc(values);
    }
  },
  Manga: {
    ...common.Series,
    chapters(inst) {
      if (inst.chapters) {
        return inst.chapters;
      }

      return inst.getChapters();
    }
  },
  // History resolvers
  Episode: {
    ...common.History,
    anime(inst) {
      if (inst.anime) {
        return inst.anime;
      }

      return inst.getAnime();
    }
  },
  Chapter: {
    ...common.History,
    manga(inst) {
      if (inst.manga) {
        return inst.manga;
      }

      return inst.getManga();
    }
  },
  // Tag resolvers
  Tag: {
    anime(inst, { sorting = null }) {
      if (inst.animes) {
        return inst.animes;
      }

      return inst.getAnimes({ order: resolveSorting(sorting) });
    },
    manga(inst, { sorting = null }) {
      if (inst.mangas) {
        return inst.mangas;
      }

      return inst.getMangas({ order: resolveSorting(sorting) });
    }
  },
  // Custom types
  StatSeriesRow: {
    season(inst) {
      return inSeasonCalc(inst).season;
    },
    year(inst) {
      return inSeasonCalc(inst).year;
    }
  },
  TimelineSeries: {
    start: common.Series.start,
    end: common.Series.end
  },
  TodoTemplate: TodoTemplateResolvers,
  TodoInstance: TodoInstanceResolvers,
  // Common resolvers
  Series: {
    __resolveType(data) {
      if (data.hasOwnProperty('episode')) {
        return 'Anime';
      } else if (data.hasOwnProperty('chapter')) {
        return 'Manga';
      }

      return null;
    }
  },
  History: {
    __resolveType() {
      return null;
    }
  },
  RepeatHistory: {
    startDateFormatted(inst) {
      return formatDate(inst.startDate);
    },
    endDateFormatted(inst) {
      return formatDate(inst.endDate);
    }
  }
};
