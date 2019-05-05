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
    return await context.findAllRepeated(
      { model: Anime, modelHistory: Episode },
      args
    );
  },
  async dailyAnime(_, { dateOffset }) {
    const d = new Date();
    d.setDate(d.getDate() - dateOffset);

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
    return await context.findAllRepeated(
      { model: Manga, modelHistory: Chapter },
      args
    );
  },
  // Series
  async seriesTimeline(
    _,
    { type, isAdult = false, fromDate, toDate, status },
    context
  ) {
    const [from, to] = dateRange(fromDate, toDate);
    const statusWhere = context.resolveWhereIn(status, 'status');
    const model = context.Stats.resolveSeriesModel(type);

    return await model.findAll({
      attributes: ['id', 'title', 'start', 'end'],
      where: {
        isAdult: { [Op.eq]: isAdult },
        start: { [Op.lt]: to },
        [Op.or]: [{ end: { [Op.eq]: null } }, { end: { [Op.gt]: from } }],
        ...statusWhere
      },
      order: [['start', 'ASC']]
    });
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
  async episodesForAnime(_, args, context) {
    return await context.pagedHistory(
      Episode,
      args,
      {
        animeId: { [Op.eq]: args.seriesId }
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
  async chaptersForManga(_, args, context) {
    return await context.pagedHistory(
      Chapter,
      args,
      {
        mangaId: { [Op.eq]: args.seriesId }
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
