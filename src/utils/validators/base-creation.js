import updatePrePost from './anime-post'
import {Enums, Properties} from '../../constants/values'
import {formatDateForInput, dateStringToISOString} from '../date'

const historyChangeHandler = ({ current, total }) => item => {
  const changes = {};
  if(item.episode === item.series_episodes && item.series_episodes !== 0 && !item.isRepeat) {
    changes.end = formatDateForInput(new Date());
    changes.status = Enums.status.completed;
  } else if (
    item.status === Enums.status.completed &&
    item.episode !== item.series_episodes &&
    item.series_episodes !== 0 && !item.isRepeat
   ) {
     changes.end = null;
     changes.status = Enums.status.ongoing;
  }

  if(item.episode > item.series_episodes && item.series_episodes !== 0) {
    changes.episode = item.series_episodes;
  }
  return Object.assign({}, changes);
}

const statusChangeHandler = item => {
  const { planned, ongoing } = Enums.status;
  switch(item.status) {
      case planned   : return { start: '', end: '' };
      case ongoing   : return { start: formatDateForInput(new Date()), end: '' };
      default        : return {};
  }
}

const repeatChangeHandler = ({ current, total }) => item => { [current]: item.isRepeat ? 0 : item[total] };

const processValidatorChanges = history => (item, property) => {
  switch(property) {
    case Properties[history]  : return historyChangeHandler(item);
    case Properties.status    : return statusChangeHandler(item);
    case Properties.isRepeat  : return repeatChangeHandler(item);
    default                   : return {};
  }
}

const validateChanges = props => (model, updateProperty) => Object.assign({}, model, processValidatorChanges(props)(model, updateProperty));

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
}

const validator = {

}

const baseValidator = (type, updateFunction) => {
  const uniqueProperties = getUniquePropertiesForItemType(type);
  return {
    validateChanges: validateChanges(),
  }
}

export default baseValidator;
