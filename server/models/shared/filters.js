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

const hasRepeatFilterArg = () => ({
  name: 'hasRepeat',
  type: 'Bool',
  description: 'isRepeat or timesComplete > 0',
  query: (rawQuery, value, resolveParams) => {
    if (value) {
      console.log('hasRepeat not implemented');
    }
  }
});

module.exports = {
  searchFilterArg,
  statusInFilterArg,
  ratingInFilterArg,
  hasRepeatFilterArg
};
