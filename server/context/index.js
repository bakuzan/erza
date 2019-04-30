const Op = require('sequelize').Op;

const { db, Tag } = require('../connectors');
const Stats = require('./statistics');
const Paged = require('./paged');
const { Status } = require('../constants/enums');
const dateRange = require('../utils/dateRange');

const handleDeleteResponse = require('./utils/handleDeleteResponse');
const isOwnedOnlyArgs = require('./utils/isOwnedOnlyArgs');
const setHasMoreFlag = require('./utils/setHasMoreFlag');
const resolveWhereIn = require('./utils/resolveWhereIn');
const separateNewVsExistingTags = require('./utils/separateNewVsExistingTags');
const mapToNewTag = require('./utils/mapToNewTag');
const validateSortOrder = require('./validators/validateSortOrder');
const validateSeries = require('./validators/validateSeries');
const validateAndMapHistoryInput = require('./validators/validateAndMapHistoryInput');

// Query

async function checkIfSeriesAlreadyExists(model, { id, malId, title = '' }) {
  const orArgs = [{ title: { [Op.eq]: title } }];

  const series = await model.count({
    where: {
      ...(id ? { id: { [Op.ne]: id } } : {}),
      [Op.or]: malId ? [...orArgs, { malId: { [Op.eq]: malId } }] : orArgs
    }
  });

  return series > 0;
}

async function findAllRepeated(
  model,
  { search = '', minTimesCompleted = 1, isAdult }
) {
  return await model.findAll({
    where: {
      title: {
        [Op.like]: `%${search}%`
      },
      isAdult: { [Op.eq]: isAdult },
      status: { [Op.eq]: Status.Completed },
      [Op.or]: [
        { isRepeat: true },
        { timesCompleted: { [Op.gte]: minTimesCompleted } }
      ]
    },
    order: [['timesCompleted', 'DESC'], ['title', 'ASC']]
  });
}

// Mutation

async function createSeries(model, payload, mappers) {
  const { tags, ...values } = payload;
  const { newTags, existingTags } = separateNewVsExistingTags(tags);

  const series = validateSeries(values, mappers);
  const exists = await checkIfSeriesAlreadyExists(model, series);

  if (exists) {
    return {
      success: false,
      errorMessages: [
        `Series "${series.title}" already exists. (Id: ${series.id}, Mal: ${
          series.malId
        })`
      ],
      data: null
    };
  }

  return db.transaction(async function(transaction) {
    const created = await model.create(
      { ...series, tags: newTags.map(mapToNewTag) },
      { include: [model.Tag], transaction }
    );

    await created.addTags(existingTags, { transaction });

    return { success: true, errorMessages: [], data: created };
  });
}

async function updateSeries(model, payload, mappers) {
  const { tags, ...values } = payload;
  const { newTags, existingTags } = separateNewVsExistingTags(tags);

  const series = validateSeries(values, mappers);
  const exists = await checkIfSeriesAlreadyExists(model, series);

  if (exists) {
    return {
      success: false,
      errorMessages: [
        `Series "${series.title}" already exists. (Id: ${series.id}, Mal: ${
          series.malId
        })`
      ],
      data: null
    };
  }

  return db.transaction(async function(transaction) {
    const { id, ...data } = series;
    const oldSeries = await model.findByPk(id, { include: [Tag], transaction });

    const removedExistingTags = oldSeries.tags.filter(
      (x) => !existingTags.some((tId) => tId === x.id)
    );
    const addedExistingTags = existingTags.filter(
      (tId) => !oldSeries.tags.some((x) => x.id === tId)
    );

    if (removedExistingTags.length) {
      await oldSeries.removeTags(removedExistingTags.map((x) => x.id), {
        transaction
      });
    }

    if (addedExistingTags.length) {
      await oldSeries.addTags(addedExistingTags, {
        transaction
      });
    }

    if (newTags.length) {
      const createdAt = Date.now();

      await Tag.bulkCreate(newTags.map(mapToNewTag), { transaction });

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

async function updateSeriesWithHistory(
  { model, modelHistory },
  { series, history },
  { mapFromSeries, mapToSeries, mapHistory },
  validateMappers
) {
  const { id: seriesId, ...updates } = series;
  const values = mapToSeries(updates);

  return await db.transaction().then(async function(transaction) {
    const oldSeries = await model.findByPk(seriesId, { transaction });
    const oldSeriesValues = oldSeries.get({ raw: true });
    const stales = mapFromSeries(oldSeriesValues);

    if (stales.current > values.current) {
      transaction.rollback();
      return {
        success: false,
        errorMessages: [
          `The current part is greater than the updated part. (Current: ${
            stales.current
          }, Updated: ${values.current})`
        ],
        data: null
      };
    }

    const { id, ...processedSeries } = validateSeries(
      mapToSeries({ ...oldSeriesValues, ...updates }),
      validateMappers
    );

    await model.update(processedSeries, {
      where: { id },
      transaction
    });

    const updated = await oldSeries.reload({ transaction });

    const validate = validateAndMapHistoryInput(
      history,
      updated.get({ raw: true }),
      {
        mapFromSeries,
        mapHistory
      }
    );

    if (!validate.success) {
      transaction.rollback();
      return {
        success: false,
        errorMessages: [...validate.errorMessages],
        data: null
      };
    }

    if (validate.historyInputs.length) {
      await modelHistory.bulkCreate(validate.historyInputs, { transaction });
    }

    transaction.commit();
    return { success: true, errorMessages: [], data: updated };
  });
}

async function updateEntity(model, args, id) {
  const updated = await model.update(args, { where: { id } });
  const data = await model.findByPk(id);
  return { success: true, errorMessages: [], data };
}

async function deleteEntity(model, where) {
  const deletedCount = await model.destroy({
    where
  });
  return handleDeleteResponse(where, deletedCount);
}

module.exports = {
  Stats,
  ...Paged,
  checkIfSeriesAlreadyExists,
  findAllRepeated,
  createSeries,
  updateSeries,
  updateSeriesWithHistory,
  updateEntity,
  deleteEntity
};
