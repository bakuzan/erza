const checkIfNameExists = type => txt => `
{
  alreadyExists: ${type}One(filter: { title: "${txt}" }) {
    _id
    title
  }
}
`;

export default {
  checkIfNameExists
};
