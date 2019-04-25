const Op = require('sequelize').Op;
const { db, Anime, Manga, Episode, Chapter, Tag } = require('../connectors');

const statistics = require('./statistics');
const { Status } = require('../constants/enums');
const dateRange = require('../utils/dateRange');
const inSeasonCalc = require('../utils/inSeason');

module.exports = {
  ...statistics,
  // Anime
  async animeById(_, { id }) {
    return await Anime.findByPk(id);
  },
  async animePaged(_, args, context) {
    return await context.pagedSeries(Anime, args);
  },
  async animeExists(_, args, context) {
    return await context.checkIfSeriesAlreadyExists(Anime, args);
  },
  async animeRepeated(_, args, context) {
    return await context.findAllRepeated(Anime, args);
  },
  async dailyAnime(_, { date }) {
    // Get this day last week
    const d = new Date(date);
    d.setDate(d.getDate() - 7);

    const [from, to] = dateRange(d, d);

    const ongoingAnimeWithEpisodes = await Anime.findAll({
      where: {
        status: { [Op.eq]: Status.Ongoing },
        isAdult: { [Op.eq]: false }
      },
      include: [
        {
          model: Episode,
          where: {
            date: {
              [Op.gte]: from,
              [Op.lt]: to
            }
          }
        }
      ]
    });

    return ongoingAnimeWithEpisodes
      .map((x) => ({ anime: x, ep: x.episodes.pop().get({ raw: true }) }))
      .filter(
        ({ anime, ep }) =>
          anime.episode === ep.episode && inSeasonCalc(anime).inSeason
      )
      .sort((a, b) => (a.ep.date > b.ep.date ? 1 : -1))
      .map(({ anime }) => anime);
  },
  // Manga
  async mangaById(_, { id }) {
    return await Manga.findByPk(id);
  },
  async mangaPaged(_, args, context) {
    return await context.pagedSeries(Manga, args);
  },
  async mangaExists(_, args, context) {
    return await context.checkIfSeriesAlreadyExists(Manga, args);
  },
  async mangaRepeated(_, args, context) {
    return await context.findAllRepeated(Manga, args);
  },
  // Episodes
  async episodes(_, { isAdult, ...args }, context) {
    return await context.pagedHistory(
      Episode,
      args,
      {
        isAdult: db.where(db.col('anime.isAdult'), {
          [Op.eq]: isAdult
        })
      },
      { include: [Anime] }
    );
  },
  // Chapters
  async chapters(_, { isAdult, ...args }, context) {
    return await context.pagedHistory(
      Chapter,
      args,
      {
        isAdult: db.where(db.col('manga.isAdult'), {
          [Op.eq]: isAdult
        })
      },
      { include: [Manga] }
    );
  },
  // Tag
  async tagById(_, { id }) {
    return await Tag.findByPk(id);
  },
  async tags(_, { search = '', isAdult = false }) {
    return Tag.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        isAdult: { [Op.eq]: isAdult }
      },
      order: [['name', 'ASC']]
    });
  }
};
