const gql = require('graphql-tag');

const {
  Statuses,
  AnimeTypes,
  MangaTypes,
  StatTypes,
  StatBreakdowns,
  RepeatPattern,
  CalendarMode
} = require('../constants/enums');

const mapArrToGraphqlString = (arr) => arr.join(' ');

module.exports = gql`
  enum Status {
    ${mapArrToGraphqlString(Statuses)}
  }
  enum AnimeType {
    ${mapArrToGraphqlString(AnimeTypes)}
  }
  enum MangaType {
    ${mapArrToGraphqlString(MangaTypes)}
  }

  enum StatType {
    ${mapArrToGraphqlString(StatTypes)}
  }
  enum StatBreakdown {
    ${mapArrToGraphqlString(StatBreakdowns)}
  }


  enum RepeatPattern {
    ${mapArrToGraphqlString(RepeatPattern)}
  }

  enum CalendarMode {
    ${mapArrToGraphqlString(CalendarMode)}
  }

  enum SortOrder {
    ASC
    DESC
  }

  enum SeriesSortField {
    TITLE
  }

  enum TagSortField {
    NAME
  }
`;
