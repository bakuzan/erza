import {constructFilterString} from '../common'

const checkIfNameExists = type => filter => `
{
  alreadyExists: ${type}CheckIfExists(${constructFilterString(filter)})
}
`;

export default {
  checkIfNameExists
};
