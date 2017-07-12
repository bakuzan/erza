import AnimeModel from '../models/anime-model'
import MangaModel from '../models/manga-model'
import EpisodeModel from '../models/episode-model'
import ChapterModel from '../models/chapter-model'
import {dateStringToISOString} from './date'
import {Enums, Strings, Properties} from '../constants/values'


export const mapEpisodeData = (anime, { _id, episode, ratings, notes }) => {
  const happened = Date.now();
  return Array(episode - anime.episode)
    .fill(null)
    .map((item, index) => {
      const episodeNumber = anime.episode + 1 + index;
      return new EpisodeModel({
        parent: _id,
        date: happened + index,
        rating: ratings[episodeNumber] || 0,
        note: notes[episodeNumber] || '',
        episode: episodeNumber,
        isAdult: anime.isAdult
      });
    });
}

export const mapChapterData = (manga, { _id, chapter, ratings, notes }) => {
  const happened = Date.now();
  return Array(chapter - manga.chapter)
    .fill(null)
    .map((item, index) => {
      const chapterNumber = manga.chapter + 1 + index;
      return new ChapterModel({
        parent: _id,
        date: happened + index,
        rating: ratings[chapterNumber] || 0,
        note: notes[chapterNumber] || '',
        chapter: chapterNumber,
        isAdult: manga.isAdult
      });
    });
}

export const mapStateToEntity = (state, id) => state.byId[id] || {};
export const mapStateToEntityList = state => state.allIds.map(id => state.byId[id]);
export const mapUrlFilterToEntityObject = ({ filter }) => ({
  name: filter,
  value: Enums.status[filter]
})

export const getUniquePropertiesForItemType = t => t === Strings.anime
  ? { current: Properties.episode, total: Properties.seriesEpisodes }
  : { current: Properties.chapter, total: Properties.seriesChapters };

export const getHistoryNameForItemType = t => t === Strings.anime
  ? Properties.episode
  : Properties.chapter;

export const itemModelForType = t => obj => t === Strings.anime ? new AnimeModel(obj) : new MangaModel(obj);

const intergrateMalEntryOptionalFields = (t, { volumes }) => t === Strings.manga ? { series_volumes: volumes || null } : {};
export const intergrateMalEntry = type => (model, malItem) => {
  if (!malItem) return Object.assign({}, model, { malId: null });

  const optionalFields = intergrateMalEntryOptionalFields(type, malItem);
  const {current, total} = getUniquePropertiesForItemType(type);
  return Object.assign({}, model, {
    title: !!model._id ? model.title : malItem.title,
    image: malItem.image,
    malId: malItem.id,
    series_type: Enums[type].type[malItem.type.replace(/\W/g, '').toLowerCase()],
    [total]: malItem[`${current}s`],
    series_start: dateStringToISOString(malItem.start_date),
    series_end: dateStringToISOString(malItem.end_date)
  }, optionalFields);
}

export const shouldIntergrateMalEntry = type => (model, malItem) => {
  if (!model || !malItem) return false;
  const { image, malId, series_type, series_start, series_end, series_episodes, series_chapters, series_volumes } = model
  return !(
    image === malItem.image &&
    malId === malItem.id &&
    series_type === Enums[type].type[malItem.type.toLowerCase()] &&
    series_chapters === malItem.chapters &&
    series_episodes === malItem.episodes &&
    series_volumes === malItem.volumes &&
    series_start === dateStringToISOString(malItem.start_date) &&
    series_end === dateStringToISOString(malItem.end_date)
  );
}
