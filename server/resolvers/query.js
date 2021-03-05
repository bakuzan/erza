const Op = require('sequelize').Op;
const {
  db,
  Anime,
  Manga,
  Episode,
  Chapter,
  Tag,
  TodoTemplate,
  TodoInstance
} = require('../connectors');

const statistics = require('./statistics');
const {
  Status,
  StatType,
  AnimeTypes,
  MangaTypes
} = require('../constants/enums');
const dateRange = require('../utils/dateRange');
const getDateRangeForCalendarMode = require('../utils/dateRangeForCalendarMode');

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
    return await context.findAllRepeated(StatType.Anime, args);
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
      .filter(({ anime, ep }) => anime.episode === ep.episode)
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
    return await context.findAllRepeated(StatType.Manga, args);
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
  async seriesByTags(_, args, context) {
    return await context.pagedSeriesByTags(args);
  },
  async seriesTypes(_, { type }) {
    switch (type) {
      case StatType.Anime:
        return AnimeTypes;
      case StatType.Manga:
        return MangaTypes;
      default:
        throw new Error('Unhandled stat type.');
    }
  },
  async seriesRepeatHistory(_, args, context) {
    return await context.getRepeatHistory(args);
  },
  async tagStats(_, args, context) {
    return await context.Stats.tagStats(args);
  },
  async tagGraph(_, args, context) {
    return await context.Stats.tagGraph(args);
  },
  async badImageSearch(_, { type, isAdult, limit }, context) {
    const model = context.Stats.resolveSeriesModel(type);
    return await model.findAll({
      attributes: ['id', 'title', 'malId', 'image'],
      where: {
        isAdult: { [Op.eq]: isAdult },
        malId: { [Op.ne]: null },
        [Op.or]: [
          { image: { [Op.eq]: null } },
          { image: { [Op.notLike]: `%imgur%` } }
        ]
      },
      limit
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
  },
  // Todo
  todoTemplateById(_, { id }) {
    return TodoTemplate.findByPk(id);
  },
  todoTemplates() {
    return TodoTemplate.findAll({
      order: [['date', 'DESC']]
    });
  },
  todoInstances(_, { todoTemplateId }) {
    const filter = todoTemplateId
      ? {
          where: {
            todoTemplateId
          }
        }
      : {};

    return TodoInstance.findAll({
      ...filter,
      order: [['date', 'DESC']]
    });
  },
  async calendarView(_, { mode, date }) {
    const order = [['date', 'asc']];
    const [fromDate, toDate] = getDateRangeForCalendarMode(mode, date);
    return await TodoInstance.findAll({
      where: {
        date: {
          [Op.lte]: toDate,
          [Op.gte]: fromDate
        }
      },
      order,
      include: [TodoTemplate]
    });
  }
};
