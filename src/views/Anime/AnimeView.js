import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { lazyLoader } from 'components/LazyLoaders';
import { loadAnimeById } from '../../actions/anime';
import {
  loadEpisodesByDateRange,
  editEpisode,
  deleteEpisode
} from '../../actions/episode';
import { mapStateToEntity, mapStateToEntityList } from '../../utils/data';
import { Strings } from '../../constants/values';

const BaseView = lazyLoader(() =>
  import(/* webpackChunkName: 'ItemView' */ '../BaseView')
);

const AnimeView = ({
  itemId,
  item,
  historyItems,
  loadAnimeById,
  loadEpisodesByDateRange,
  editEpisode,
  deleteEpisode,
  ...props
}) => (
  <BaseView
    {...props}
    type={Strings.anime}
    itemId={itemId}
    item={item}
    historyItems={historyItems}
    loadItemById={loadAnimeById}
    loadHistoryForSeries={loadEpisodesByDateRange}
    editAction={editEpisode}
    deleteAction={deleteEpisode}
  />
);

AnimeView.propTypes = {
  itemId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  historyItems: PropTypes.arrayOf(PropTypes.object),
  loadAnimeById: PropTypes.func.isRequired,
  loadEpisodesByDateRange: PropTypes.func.isRequired,
  editEpisode: PropTypes.func.isRequired,
  deleteEpisode: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  itemId: ownProps.match.params.id,
  item: mapStateToEntity(state.entities.anime, ownProps.match.params.id),
  historyItems: mapStateToEntityList(state.entities.episode)
});

const mapDispatchToProps = {
  loadAnimeById,
  loadEpisodesByDateRange,
  editEpisode,
  deleteEpisode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnimeView);
