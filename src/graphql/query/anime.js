const getAll = `
  query allAnime {
    animes {
      id,
      title,
      episode,
      start,
      end,
      status,
      isAdult,
      owned,
      image,
      malId,
      series_episodes,
      updatedDate
    }
  }
`;

const getByStatus = (status) => (`
  query animeByStatus {
    animes(status: ${status}) {
      id,
      title,
      episode,
      start,
      end,
      status,
      isAdult,
      owned,
      image,
      malId,
      series_episodes,
      updatedDate
    }
  }
`);

const getById = (id) => (`
  query animeById {
    anime(id: "${id}") {
      id,
      title,
      episode,
      start,
      end,
      status,
      rating,
      isAdult,
      isRepeat,
      owned,
      image,
      malId,
      series_episodes,
      updatedDate
    }
  }
`);

const AnimeQL = {
  getAll,
  getById,
  getByStatus
};

export default AnimeQL;
