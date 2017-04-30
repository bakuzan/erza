const updateAnimeById = (anime) => (`
  mutation {
    animeUpdateById(${anime}) {

    }
  }
`)

const AnimeML = {
  updateAnimeById
};

export default AnimeML;
