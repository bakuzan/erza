module.exports = function validateAndMapHistoryInput(
  history,
  updatedSeries,
  { mapFromSeries, mapHistory }
) {
  const series = mapFromSeries(updatedSeries);

  if (!history || !history.length) {
    return {
      success: true,
      errorMessages: [],
      historyInputs: []
    };
  }

  if (history.some((x) => x.number > series.current)) {
    return {
      success: false,
      errorMessages: [
        `History entries exceed series current value. (Current: ${
          series.current
        })`
      ],
      historyInputs: []
    };
  }

  if (history.some((x) => !x.number)) {
    return {
      success: false,
      errorMessages: [`History entries must have a number`],
      historyInputs: []
    };
  }

  const historyInputs = history.map((h) =>
    mapHistory({ ...h, seriesId: series.id })
  );

  return {
    success: true,
    errorMessages: [],
    historyInputs
  };
};
