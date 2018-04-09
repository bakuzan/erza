import {
  itemKeyFields,
  itemEditFields,
  pagedDataWrapper,
  constructFilterString
} from '../common';

const getFilteredList = (type, fields) => (pageParameters, filters) => `
  {
    ${type}Connection(${pageParameters}${constructFilterString(filters)}) {
      ${pagedDataWrapper(itemKeyFields(fields))}
    }
  }
`;

const getById = (type, fields) => id => `
  {
    ${type}ById(_id: "${id}") {
      ${itemKeyFields(fields)}
      start
      end
      rating
      isAdult
      timesCompleted
      tagList {
        _id
        name
      }
    }
  }
`;

const getByIdForEdit = (type, fields) => id => `
  {
    ${type}ById(_id: "${id}") {
      ${itemEditFields(fields)}
      tags
    }
  }
`;

const getByIdForQuickAdd = (type, fields) => id => `
  {
    ${type}ById(_id: "${id}") {
      ${itemEditFields(fields)}
    }
  }
`;

const checkIfNameExists = type => filter => `
{
  alreadyExists: ${type}CheckIfExists(${constructFilterString(filter)})
}
`;

export default {
  getById,
  getFilteredList,
  getByIdForEdit,
  getByIdForQuickAdd,
  checkIfNameExists
};
