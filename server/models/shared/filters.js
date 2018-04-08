const searchFilterArg = {
  name: 'search',
  type: 'String',
  description: 'Search by regExp on title',
  query: (query, value, resolveParams) => {
    const str = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape all regex special characters
    query.title = new RegExp(str, 'gi');
  }
};

const statusInFilterArg = type => ({
  name: 'statusIn',
  type: [type.getFieldType('status')],
  description: 'Status in given array',
  query: (rawQuery, value, resolveParams) => {
    if (value && value.length > 0) {
      rawQuery.status = { $in: value };
    }
  }
});

const ratingInFilterArg = type => ({
  name: 'ratingIn',
  type: [type.getFieldType('rating')],
  description: 'Rating in given array',
  query: (rawQuery, value, resolveParams) => {
    if (value && value.length > 0) {
      rawQuery.rating = { $in: value };
    }
  }
});

const timesCompletedMinFilterArg = {
  name: 'timesCompletedMin',
  type: 'Float',
  description: 'Minimum value for timesCompleted',
  query: (rawQuery, value, resolveParams) => {
    rawQuery.timesCompleted = { $gte: value };
  }
};

const isOwnedOnlyFilterArg = {
  name: 'isOwnedOnly',
  type: 'Boolean',
  description: 'If true, only return owned, else return all',
  query: (rawQuery, value, resolveParams) => {
    console.log('FILTER ARG > ', rawQuery, value);
    if (value) {
      rawQuery.owned = { $eq: value };
    }
  }
};

module.exports = {
  searchFilterArg,
  statusInFilterArg,
  ratingInFilterArg,
  timesCompletedMinFilterArg,
  isOwnedOnlyFilterArg
};
