const Op = require('sequelize').Op;
const { db, Anime, Manga, Episode, Chapter, Tag } = require('../connectors');

const statistics = require('./statistics');
const { Status } = require('../constants/enums');
const dateRange = require('../utils/dateRange');

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
    const d = new Date(date);
    d.setDate(-7);
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

    return ongoingAnimeWithEpisodes.filter((x) => x.episodes.length);
  },
  async animeAiring() {
    // TODO
    // this is part of the statistics rewriting that needs to be done
    return await Anime.findAll({
      where: {
        isAdult: { [Op.eq]: false },
        status: { [Op.eq]: Status.Ongoing }
      },
      order: []
    });
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
    return Tag.findAndCountAll({
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
