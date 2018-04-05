const checkIfNameExists = type => filter => `
{
  alreadyExists: ${type}CheckIfExists(filter: {
    title: "${filter.title || ''}",
    id: ${`"${filter.id}"` || null}
    malId: ${filter.malId || null}
  })
}
`;

export default {
  checkIfNameExists
};
