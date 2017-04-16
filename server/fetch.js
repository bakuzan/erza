const graphql = require('graphql');

const fetchMe = (res, schema, query) => {
  return graphql(schema, query).then((result) => {
    console.log(result);
    res.jsonp(result);
  });
}

module.exports = fetchMe;
