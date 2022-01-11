const Op = require('sequelize').Op;

const { db, Tag } = require('../connectors');
const SQL = require('../db-scripts');
const Stats = require('./statistics');
const Paged = require('./paged');
const Todo = require('./todo');
const updateSeriesWithHistory = require('./update-series/withHistory');
const updateSeriesTags = require('./update-series/tags');
const getRepeatHistory = require('./repeatHistory');

const { StatType } = require('../constants/enums');
const imageStore = require('../image-store');
const handleDeleteResponse = require('./utils/handleDeleteResponse');
const resolveWhereIn = require('./utils/resolveWhereIn');
const separateNewVsExistingTags = require('./utils/separateNewVsExistingTags');
const mapToNewTag = require('./utils/mapToNewTag');
const validateSeries = require('./validators/validateSeries');

// Query

async function checkIfSeriesAlreadyExists(model, { id, malId, title = '' }) {
  const matchesTitle = { title: { [Op.eq]: title } };
  const matchesMal = { malId: { [Op.eq]: malId } };

  const series = await model.findOne({
    where: {
      ...(id ? { id: { [Op.ne]: id } } : {}),
      ...(malId ? matchesMal : matchesTitle)
    }
  });

  return {
    exists: series !== null,
    id: series ? series.id : null,
    title: series ? series.title : null
  };
}

async function findAllRepeated(
  type,
  { search = '', minTimesCompleted = 1, isAdult }
) {
  const qk =
    type === StatType.Anime ? 'get_repeated_anime' : 'get_repeated_manga';

  return await db.query(SQL[qk], {
    type: db.QueryTypes.SELECT,
    replacements: {
      search: `%${search}%`,
      isAdult,
      minTimesCompleted
    }
  });
}

async function getRecurrentAnime(dayOfWeekNumber) {
  return await db.query(SQL['get_recurrent_anime'], {
    type: db.QueryTypes.SELECT,
    replacements: {
      dayOfWeekNumber
    }
  });
}

// Mutation

async function createSeries(model, payload, mappers) {
  const { tags, tagString, ...values } = payload;
  const { newTags, existingTags } = separateNewVsExistingTags(tags);

  const series = validateSeries(values, mappers);
  const { exists } = await checkIfSeriesAlreadyExists(model, series);

  if (exists) {
    return {
      success: false,
      errorMessages: [
        `Series "${series.title}" already exists. (Id: ${series.id}, Mal: ${series.malId})`
      ],
      data: null
    };
  }

  // Handle tags passed as comma-separated string (tag names are unique!)
  if (tagString && tagString.trim()) {
    const ts = tagString
      .split(',')
      .map((x) => (x ? x.trim() : null))
      .filter((x) => Boolean(x));

    const currTags = await Tag.findAll({
      raw: true,
      attributes: ['id', 'name'],
      where: { name: { [Op.in]: ts } }
    });

    existingTags.push(...currTags.map((x) => x.id));
    newTags.push(...ts.filter((x) => !currTags.some((c) => c.name === x)));
  }

  if (series.image && !series.image.includes('imgur')) {
    const result = await imageStore.uploadUrl(series.image);

    if (!result.success) {
      return {
        success: false,
        errorMessages: [`Failed to upload series image`, result.error.message],
        data: null
      };
    }

    series.image = result.url;
  }

  return db.transaction(async function (transaction) {
    const created = await model.create(
      { ...series, tags: newTags.map(mapToNewTag(series.isAdult)) },
      { include: [model.Tag], transaction }
    );

    await created.addTags(existingTags, { transaction });

    return { success: true, errorMessages: [], data: created };
  });
}

async function updateSeries(model, payload, mappers) {
  const { tags, ...values } = payload;
  const { newTags, existingTags } = separateNewVsExistingTags(tags);

  const { exists } = await checkIfSeriesAlreadyExists(model, values);

  if (exists) {
    return {
      success: false,
      errorMessages: [
        `Series "${values.title}" already exists. (Id: ${values.id}, Mal: ${values.malId})`
      ],
      data: null
    };
  }

  return db.transaction(async function (transaction) {
    const oldSeries = await model.findByPk(values.id, {
      include: [Tag],
      transaction
    });
    const oldSeriesValues = oldSeries.get({ raw: true });

    const series = validateSeries({ ...oldSeriesValues, ...values }, mappers);
    const { id, ...data } = series;

    const oldImage = oldSeriesValues.image;
    const hasNewImage = data.image && data.image !== oldImage;
    if (hasNewImage && !data.image.includes('imgur')) {
      const result = await imageStore.uploadUrl(data.image);

      if (!result.success) {
        return {
          success: false,
          errorMessages: [
            `Failed to upload series image`,
            result.error.message
          ],
          data: null
        };
      }

      series.image = result.url;
    }

    // Only run tags update if property is sent.
    if (payload.hasOwnProperty('tags')) {
      const removedExistingTags = oldSeries.tags.filter(
        (x) => !existingTags.some((tId) => tId === x.id)
      );
      const addedExistingTags = existingTags.filter(
        (tId) => !oldSeries.tags.some((x) => x.id === tId)
      );

      if (removedExistingTags.length) {
        await oldSeries.removeTags(
          removedExistingTags.map((x) => x.id),
          {
            transaction
          }
        );
      }

      if (addedExistingTags.length) {
        await oldSeries.addTags(addedExistingTags, {
          transaction
        });
      }
    }

    if (newTags.length) {
      const createdAt = Date.now();

      await Tag.bulkCreate(newTags.map(mapToNewTag(data.isAdult)), {
        transaction
      });

      const createdTags = await Tag.findAll({
        where: { createdAt: { [Op.gte]: createdAt } },
        transaction
      });

      await oldSeries.addTags(createdTags, { transaction });
    }

    await model.update({ ...data }, { where: { id }, transaction });

    const updated = await oldSeries.reload({ transaction });

    return { success: true, errorMessages: [], data: updated };
  });
}

async function updateEntity(model, args, id) {
  await model.update(args, { where: { id } });
  const data = await model.findByPk(id);
  return { success: true, errorMessages: [], data };
}

async function deleteEntity(model, where) {
  const deletedCount = await model.destroy({
    where
  });
  return handleDeleteResponse(where.id, deletedCount);
}

module.exports = {
  Stats,
  ...Paged,
  ...Todo,
  checkIfSeriesAlreadyExists,
  findAllRepeated,
  getRecurrentAnime,
  createSeries,
  updateSeries,
  updateSeriesWithHistory,
  updateSeriesTags,
  updateEntity,
  deleteEntity,
  getRepeatHistory,
  //Helpers
  resolveWhereIn,
  handleDeleteResponse
};
