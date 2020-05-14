import gql from 'graphql-tag';

// Fragments

const seriesFields = gql`
  fragment SeriesFields on Series {
    id
    title
    status
    isRepeat
    owned
    image
    link
    malId
  }
`;

const seriesByIdFields = gql`
  ${seriesFields}
  fragment SeriesByIdFields on Series {
    start
    end
    rating
    isAdult
    timesCompleted
    tags(sorting: { field: NAME, order: ASC }) {
      id
      name
    }
  }
`;

const seriesByIdEditFields = gql`
  ${seriesFields}
  fragment SeriesEditFields on Series {
    start
    end
    rating
    isAdult
    series_start
    series_end
    tags(sorting: { field: NAME, order: ASC }) {
      id
      name
    }
  }
`;

// TODO source the date of last repeat!!
const repeatedFields = gql`
  fragment RepeatedFields on Series {
    id
    title
    rating
    owned
    timesCompleted
  }
`;

const animeFields = gql`
  fragment AnimeFields on Anime {
    episode
    series_episodes
  }
`;

const mangaFields = gql`
  fragment MangaFields on Manga {
    chapter
    volume
    series_chapters
    series_volumes
  }
`;

// Queries

// By Id

export const getAnimeById = gql`
  query AnimeOne($id: Int!) {
    animeById(id: $id) {
      ...SeriesFields
      ...SeriesByIdFields
      ...AnimeFields
      season {
        inSeason
        season
        year
      }
    }
  }
  ${seriesByIdFields}
  ${animeFields}
`;

export const getAnimeByIdForEdit = gql`
  query AnimeOneEdit($id: Int!) {
    animeById(id: $id) {
      ...SeriesFields
      ...SeriesEditFields
      ...AnimeFields
      series_type
      _legacyIsSeason
    }
  }
  ${seriesByIdEditFields}
  ${animeFields}
`;

export const getAnimeByIdForQuickAdd = gql`
  query AnimeOneQuickAdd($id: Int!) {
    animeById(id: $id) {
      id
      rating
      episode
      series_episodes
      updatedAt
    }
  }
`;

export const getMangaById = gql`
  query MangaOne($id: Int!) {
    mangaById(id: $id) {
      ...SeriesFields
      ...SeriesByIdFields
      ...MangaFields
    }
  }
  ${seriesByIdFields}
  ${mangaFields}
`;

export const getMangaByIdForEdit = gql`
  query MangaOneEdit($id: Int!) {
    mangaById(id: $id) {
      ...SeriesFields
      ...SeriesEditFields
      ...MangaFields
      series_type
    }
  }
  ${seriesByIdEditFields}
  ${mangaFields}
`;

export const getMangaByIdForQuickAdd = gql`
  query MangaOneQuickAdd($id: Int!) {
    mangaById(id: $id) {
      id
      rating
      chapter
      volume
      series_chapters
      series_volumes
      updatedAt
    }
  }
`;

// Paged

export const getAnimePaged = gql`
  query AnimePage(
    $search: String
    $status: [Status]
    $isOwnedOnly: Boolean
    $isAdult: Boolean
    $sorting: [String]
    $paging: Paging
  ) {
    animePaged(
      search: $search
      status: $status
      isOwnedOnly: $isOwnedOnly
      isAdult: $isAdult
      sorting: $sorting
      paging: $paging
    ) {
      total
      hasMore
      nodes {
        ...SeriesFields
        ...AnimeFields
        updatedAt
      }
    }
  }
  ${seriesFields}
  ${animeFields}
`;

export const getMangaPaged = gql`
  query MangaPage(
    $search: String
    $status: [Status]
    $isOwnedOnly: Boolean
    $isAdult: Boolean
    $sorting: [String]
    $paging: Paging
  ) {
    mangaPaged(
      search: $search
      status: $status
      isOwnedOnly: $isOwnedOnly
      isAdult: $isAdult
      sorting: $sorting
      paging: $paging
    ) {
      total
      hasMore
      nodes {
        ...SeriesFields
        ...MangaFields
        updatedAt
      }
    }
  }
  ${seriesFields}
  ${mangaFields}
`;

// Check Exists
export const checkAnimeExists = gql`
  query AnimeExists($id: Int, $malId: Int, $title: String) {
    animeExists(id: $id, malId: $malId, title: $title)
  }
`;

export const checkMangaExists = gql`
  query MangaExists($id: Int, $malId: Int, $title: String) {
    mangaExists(id: $id, malId: $malId, title: $title)
  }
`;

// Repeated
export const getAnimeRepeated = gql`
  query AnimeRepeated($search: String, $minTimes: Int, $isAdult: Boolean) {
    animeRepeated(
      search: $search
      minTimesCompleted: $minTimes
      isAdult: $isAdult
    ) {
      ...RepeatedFields
    }
  }
  ${repeatedFields}
`;

export const getMangaRepeated = gql`
  query MangaRepeated($search: String, $minTimes: Int, $isAdult: Boolean) {
    mangaRepeated(
      search: $search
      minTimesCompleted: $minTimes
      isAdult: $isAdult
    ) {
      ...RepeatedFields
    }
  }
  ${repeatedFields}
`;

// Daily Anime
export const getDailyAnime = gql`
  query DailyAnime($dateOffset: Int!) {
    dailyAnime(dateOffset: $dateOffset) {
      id
      title
      episode
    }
  }
`;

// Timelines
export const getTimeline = gql`
  query SeriesTimeline(
    $type: StatType!
    $isAdult: Boolean
    $from: String!
    $to: String!
    $status: [Status]
  ) {
    seriesTimeline(
      type: $type
      isAdult: $isAdult
      fromDate: $from
      toDate: $to
      status: $status
    ) {
      id
      name: title
      startDate: start
      endDate: end
    }
  }
`;
