class AnimeModel {
  constructor(props = this.initaliseDefaults()) {
    Object.assign(this, props);
  }

  initaliseDefaults() {
    return {
      id: null,
      title: '',
      episode: 0,
      status: 1,  // 1 / ongoing, 2 / completed, 3 / onhold, 4 / dropped, 6 / planned
      rating: 0,
      isAdult: false,
      start: '',
      end: '',
      /* season will be derived from data
       *  inSeason = series.start < start < series.end
       *  season = series.start.getMonth    //  [0,1,2] = Winter, [3,4,5] = Spring, [6,7,8] = Summer, [9,10,11] = Fall
       *  year = series.start.getFullYear()
        season: {
          inSeason: false,
          season: '',
          year: 0
        },
      */
      tags: Array(0), // Array of Tag id's
      owned: false,
      image: '',
      isRepeat: false,   // is rewatching
      timesCompleted: 0, // number of re-watches
      malId: null,
      // Series data populated by mal entry
      series: {
        type: 0, // 0 = Unknown, 1 = TV, 2 = OVA, 3 = Movie, 4 = Special, 5 = ONA, 6 = Music
        episodes: null,
        start: null,
        end: null,
      }
      /* Meta-data handled exclusively on the server.
        created:
        updated:
      */
    };
  }

}

export default AnimeModel;
