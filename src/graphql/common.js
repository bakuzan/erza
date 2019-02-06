import { Utils } from 'meiko';
import { NonPostableProperties } from '../constants/values';

export const constructRecordForPost = Utils.GraphqlProcessing.constructRecordForPost(
  NonPostableProperties
);

export const {
  pagedDataWrapper,
  constructPagingAndSorting,
  constructFilterString
} = Utils.GraphqlProcessing;

export const itemKeyFields = (uniqueFields) => `
  _id
  title
  status
  isRepeat
  owned
  image
  link
  malId
  updatedDate
  ${uniqueFields}
`;

export const itemEditFields = (uniqueFields) => `
  ${itemKeyFields(uniqueFields)}
  start
  end
  rating
  isAdult
  series_type
  series_start
  series_end
  timesCompleted
`;

export const historyKeyFields = (uniqueField) => `
  _id
  parent
  date
  rating
  note
  ${uniqueField}
`;

export const historyKeyFieldsWithSeries = (uniqueField) => `
  ${historyKeyFields(uniqueField)}
  series {
    _id
    title
  }
`;
