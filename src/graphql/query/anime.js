const getAll = `
  query allAnime {
    animes {
      _id,
      title,
      start,
      end,
      status,
      owned,
      malId,
      series_episodes,
      updatedDate
    }
  }
`;

const getById = (id) => (`
  query animeById {
    anime(id: Object(${id})) {
      _id,
      title
    }
  }
`);

const AnimeQL = {
  getAll,
  getById
};

export default AnimeQL;
