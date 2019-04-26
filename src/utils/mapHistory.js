import EpisodeModel from '../models/episodeModel';
import ChapterModel from '../models/chapterModel';

export function mapEpisodeData(anime, { id, episode, ratings, notes }) {
  const happened = Date.now();
  return Array(episode - anime.episode)
    .fill(null)
    .map((item, index) => {
      const episodeNumber = anime.episode + 1 + index;
      return new EpisodeModel({
        parent: id,
        date: happened + index,
        rating: ratings[episodeNumber] || 0,
        note: notes[episodeNumber] || '',
        episode: episodeNumber,
        isAdult: anime.isAdult
      });
    });
}

export function mapChapterData(manga, { id, chapter, ratings, notes }) {
  const happened = Date.now();
  return Array(chapter - manga.chapter)
    .fill(null)
    .map((item, index) => {
      const chapterNumber = manga.chapter + 1 + index;
      return new ChapterModel({
        parent: id,
        date: happened + index,
        rating: ratings[chapterNumber] || 0,
        note: notes[chapterNumber] || '',
        chapter: chapterNumber,
        isAdult: manga.isAdult
      });
    });
}
