const { resolveSorting } = require('../../utils');
const {
  formatDateInput,
  formatDateTimeInput
} = require('../../utils/formatDate');

module.exports = {
  Series: {
    tags(instance, { sorting = null }) {
      if (instance.tags) {
        return instance.tags;
      }

      return instance.getTags({ order: resolveSorting(sorting) });
    },
    start(inst) {
      return formatDateInput(inst.start);
    },
    end(inst) {
      return formatDateInput(inst.end);
    },
    series_start(inst) {
      return formatDateInput(inst.series_start);
    },
    series_end(inst) {
      return formatDateInput(inst.series_end);
    },
    updatedAt(inst) {
      return formatDateTimeInput(inst.updatedAt);
    },
    lastRepeatDate(inst) {
      const d = inst.lastRepeatDate;
      return d ? formatDateInput(d) : '';
    }
  },
  History: {
    date(inst) {
      return formatDateTimeInput(inst.date);
    },
    isRepeat(inst) {
      const series = (inst.anime || inst.manga || {}).dataValues;
      return (
        series &&
        series.end &&
        formatDateInput(series.end) < formatDateInput(inst.date)
      );
    }
  }
};
