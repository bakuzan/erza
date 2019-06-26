const { query, writeOut, capitalise } = require('./utils');

const BAD_IMAGE_SEARCH = `
  query SeriesImageData($type: StatType!, $isAdult: Boolean!, $limit: Int) {
    value: badImageSearch(type: $type, isAdult: $isAdult, limit: $limit) {
      id
      malId
      title
      image
    }
  }  
`;

module.exports = async function exportImageData(type, isAdult) {
  const data = await query(`/graphql`, {
    query: BAD_IMAGE_SEARCH,
    variables: {
      type: capitalise(type),
      isAdult,
      limit: 50
    }
  });

  await writeOut(`bad_images`, { type, isAdult, data });
};
