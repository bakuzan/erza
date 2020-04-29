const { db } = require('../../connectors');

const validateSeries = require('../validators/validateSeries');
const validateAndMapHistoryInput = require('../validators/validateAndMapHistoryInput');

module.exports = async function updateSeriesWithHistory(
  { model, modelHistory },
  { series, history },
  { mapFromSeries, mapToSeries, mapHistory },
  validateMappers
) {
  const { id: seriesId, ...updates } = series;
  const values = mapToSeries(updates);

  return await db.transaction().then(async function (transaction) {
    const oldSeries = await model.findByPk(seriesId, { transaction });
    const oldSeriesValues = oldSeries.get({ raw: true });
    const stales = mapFromSeries(oldSeriesValues);

    if (stales.current > values.current) {
      transaction.rollback();
      return {
        success: false,
        errorMessages: [
          `The current part is greater than the updated part. (Current: ${stales.current}, Updated: ${values.current})`
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
};
