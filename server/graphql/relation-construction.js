const {
  seriesRelations,
  historySeriesLink,
  tagSeriesLink
} = require('./relation-helpers');
const { AnimeTC } = require('../models/anime');
const { MangaTC } = require('../models/manga');
const { TagTC } = require('../models/tag');
const { EpisodeTC } = require('../models/episode');
const { ChapterTC } = require('../models/chapter');

AnimeTC.addRelation('tagList', seriesRelations.tagList(TagTC));
AnimeTC.addRelation('historyList', seriesRelations.historyList(EpisodeTC));
EpisodeTC.addRelation('series', historySeriesLink(AnimeTC));
TagTC.addRelation('animeWithTag', tagSeriesLink(AnimeTC));

MangaTC.addRelation('tagList', seriesRelations.tagList(TagTC));
MangaTC.addRelation('historyList', seriesRelations.historyList(ChapterTC));
ChapterTC.addRelation('series', historySeriesLink(MangaTC));
TagTC.addRelation('mangaWithTag', tagSeriesLink(MangaTC));

module.exports = {
  AnimeTC,
  MangaTC,
  EpisodeTC,
  ChapterTC,
  TagTC
};
