const Op = require('sequelize').Op;

const Stats = require('./statistics');
const { Status } = require('../constants/enums');
const dateRange = require('../utils/dateRange');

const isOwnedOnlyArgs = require('./utils/isOwnedOnlyArgs');
const setHasMoreFlag = require('./utils/setHasMoreFlag');
const validateSortOrder = require('./utils/validateSortOrder');
const resolveWhereIn = require('./utils/resolveWhereIn');
const separateNewVsExistingTags = require('./utils/separateNewVsExistingTags');
const validateSeries = require('./validators/validateSeries');

// Query

async function checkIfSeriesAlreadyExists(model, { id, malId, title = '' }) {
  const orArgs = [{ title: { [Op.eq]: title } }];

  const series = await model.findOne({
    where: {
      id: { [Op.ne]: id },
      [Op.or]: malId ? [...orArgs, { malId: { [Op.eq]: malId } }] : orArgs
    }
  });

  return series !== null;
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
  const exists = checkIfSeriesAlreadyExists(model, series);

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

  const created = await model.create(
    { ...series, tags: newTags },
    { include: [model.Tag] }
  );

  await created.addTags(existingTags);

  return { success: true, errorMessages: [], data: created };
}

async function updateEntity(model, args, id) {
  const updated = await model.update(args, { where: { id } });
  console.log('UPDATED?', updated);
  return { success: true, errorMessages: [], data: updated };
}

async function deleteEntity(model, where) {
  const deletedCount = await model.destroy({
    where
  });
  return handleDeleteResponse(where, deletedCount);
}

module.exports = {
  Stats,
  findAllRepeated,
  createSeries,
  updateEntity,
  deleteEntity,
  ...paged
};
