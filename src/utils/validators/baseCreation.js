import { Enums, Properties } from '../../constants/values';
import {
  getUniquePropertiesForItemType,
  getHistoryNameForItemType
} from '../data';

import { formatDateForInput } from 'utils';
// dateStringToISOString

const historyChangeHandler = ({ current, total }) => (item) => {
  const changes = {};

  if (item[current] > item[total] && item[total] !== 0) {
    changes[current] = item[total];
  }

  if (item[current] >= item[total] && item[total] !== 0 && !item.isRepeat) {
    changes.end = formatDateForInput(new Date());
    changes.status = Enums.status.Completed;
  } else if (
    item.status === Enums.status.Completed &&
    item[current] !== item[total] &&
    item[total] !== 0 &&
    !item.isRepeat
  ) {
    changes.end = null;
    changes.status = Enums.status.Ongoing;
  }

  return Object.assign({}, changes);
};

const statusChangeHandler = (item) => {
  const { Planned, Ongoing, Completed } = Enums.status;

  switch (item.status) {
    case Planned:
      return { start: '', end: '' };
    case Ongoing:
      return {
        start: formatDateForInput(item.start || new Date()),
        end: ''
      };
    case Completed:
      return { end: formatDateForInput(item.end || new Date()) };
    default:
      return {};
  }
};

const repeatChangeHandler = ({ current, total }) => (item) => ({
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

const validateChanges = (props) => (model, updateProperty) => {
  const processor = processValidatorChanges(props);
  return Object.assign({}, model, processor(model, updateProperty));
};

// const validateSubmission = (updateFunction) => (model) => {
//   const { start, end, series_start, series_end } = model;
//   return updateFunction(
//     Object.assign({}, model, {
//       tags: model.tags.map((tag) => tag.id),
//       start: dateStringToISOString(start),
//       end: dateStringToISOString(end),
//       series_start: dateStringToISOString(series_start),
//       series_end: dateStringToISOString(series_end)
//     })
//   );
// };

export default function baseValidator(type) {
  const uniqueProperties = getUniquePropertiesForItemType(type);
  const history = getHistoryNameForItemType(type);

  return {
    validateChanges: validateChanges({ uniqueProperties, history })
  };
}
