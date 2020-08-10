import { connect } from 'react-redux';

import { lazyLoader } from 'components/LazyLoaders';
import { loadAnimeById, deleteAnime, addEpisodes } from 'actions/anime';
import {
  loadEpisodesBySeries,
  editEpisode,
  deleteEpisode
} from 'actions/episode';
import { nextPage } from 'actions/paging';
import { Strings } from 'constants/values';
import {
  mapStateToEntity,
  mapStateToEntityList,
  getHistoryNameForItemType
} from 'utils/data';

const BaseView = lazyLoader(() =>
  import(/* webpackChunkName: 'ItemView' */ '../BaseView')
);

const mapStateToProps = (state, ownProps) => ({
  type: Strings.anime,
  isFetching: state.isFetching,
  itemId: Number(ownProps.match.params.id),
  item: mapStateToEntity(state.entities.anime, ownProps.match.params.id),
  historyItems: mapStateToEntityList(state.entities.episode).filter(
    (x) => x.series && x.series.id === Number(ownProps.match.params.id)
  ),
  ...state.paging[getHistoryNameForItemType(Strings.anime)]
});

const mapDispatchToProps = {
  loadItemById: loadAnimeById,
  loadHistoryForSeries: loadEpisodesBySeries,
  editAction: editEpisode,
  deleteAction: deleteEpisode,
  deleteSeries: deleteAnime,
  onLoadMoreHistory: nextPage,
  addHistoryToItem: addEpisodes
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseView);
