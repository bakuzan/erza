const {
  formatDateInput,
  formatDateTimeInput
} = require('../../utils/formatDate');

// TODO
// Compare the dates returned to the current way of doing things!
// Fix accordingly

module.exports = {
  Series: {
    tags(instance) {
      if (instance.tags) {
        return instance.tags;
      }

      return instance.getTags();
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
    }
  },
  History: {
    date(inst) {
      return formatDateTimeInput(inst.date);
    }
  }
};
