import { connect } from 'react-redux';

import { lazyLoader } from 'components/LazyLoaders';
import { loadAnimeById, deleteAnime } from '../../actions/anime';
import {
  loadEpisodesBySeries,
  editEpisode,
  deleteEpisode
} from '../../actions/episode';
import { mapStateToEntity, mapStateToEntityList } from '../../utils/data';
import { Strings } from '../../constants/values';

const BaseView = lazyLoader(() =>
  import(/* webpackChunkName: 'ItemView' */ '../BaseView')
);

const mapStateToProps = (state, ownProps) => ({
  type: Strings.anime,
  isFetching: state.isFetching,
  itemId: Number(ownProps.match.params.id),
  item: mapStateToEntity(state.entities.anime, ownProps.match.params.id),
  historyItems: mapStateToEntityList(state.entities.episode)
});

const mapDispatchToProps = {
  loadItemById: loadAnimeById,
  loadHistoryForSeries: loadEpisodesBySeries,
  editAction: editEpisode,
  deleteAction: deleteEpisode,
  deleteSeries: deleteAnime
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseView);
