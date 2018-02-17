import { Enums, Properties } from '../../constants/values';
import { formatDateForInput, dateStringToISOString } from '../date';
import {
  getUniquePropertiesForItemType,
  getHistoryNameForItemType
} from '../data';

const historyChangeHandler = ({ current, total }) => item => {
  const changes = {};

  if (item[current] > item[total] && item[total] !== 0) {
    changes[current] = item[total];
  }

  if (item[current] >= item[total] && item[total] !== 0 && !item.isRepeat) {
    changes.end = formatDateForInput(new Date());
    changes.status = Enums.status.completed;
  } else if (
    item.status === Enums.status.completed &&
    item[current] !== item[total] &&
    item[total] !== 0 &&
    !item.isRepeat
  ) {
    changes.end = null;
    changes.status = Enums.status.ongoing;
  }

  return Object.assign({}, changes);
};

const statusChangeHandler = item => {
  const { planned, ongoing } = Enums.status;
  switch (item.status) {
    case planned:
      return { start: '', end: '' };
    case ongoing:
      return { start: formatDateForInput(item.start || new Date()), end: '' };
    default:
      return {};
  }
};

const repeatChangeHandler = ({ current, total }) => item => ({
  [current]: item.isRepeat ? 0 : item[total]
});

const processValidatorChanges = ({ history, uniqueProperties }) => (
  item,
  property
) => {
  switch (property) {
    case Properties[history]:
      return historyChangeHandler(uniqueProperties)(item);
    case Properties.status:
      return statusChangeHandler(item);
    case Properties.isRepeat:
      return repeatChangeHandler(uniqueProperties)(item);
    default:
      return {};
  }
};

const validateChanges = props => (model, updateProperty) => {
  const processor = processValidatorChanges(props);
  return Object.assign({}, model, processor(model, updateProperty));
};

const validateSubmission = updateFunction => model => {
  const { start, end, series_start, series_end } = model;
  return updateFunction(
    Object.assign({}, model, {
      tags: model.tags.map(tag => tag._id),
      start: dateStringToISOString(start),
      end: dateStringToISOString(end),
      series_start: dateStringToISOString(series_start),
      series_end: dateStringToISOString(series_end)
    })
  );
};

const baseValidator = (type, updateFunction) => {
  const uniqueProperties = getUniquePropertiesForItemType(type);
  const history = getHistoryNameForItemType(type);

  return {
    validateChanges: validateChanges({ uniqueProperties, history }),
    validateSubmission: validateSubmission(updateFunction)
  };
};

export default baseValidator;
