import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import Loaders from '../../components/loaders/index';
import { loadAnimeById } from '../../actions/anime';
import {
  loadEpisodeForSeries,
  editEpisode,
  deleteEpisode
} from '../../actions/episode';
import { mapStateToEntity, mapStateToEntityList } from '../../utils/data';
import { Strings } from '../../constants/values';

const BaseView = Loadable({
  loader: () => import(/* webpackChunkName: 'item-view' */ '../base-view'),
  loading: Loaders.Loadables.SimpleLoading,
  delay: 300
});

const AnimeView = ({
  itemId,
  item,
  historyItems,
  loadAnimeById,
  loadEpisodeForSeries,
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
    loadHistoryForSeries={loadEpisodeForSeries}
    editAction={editEpisode}
    deleteAction={deleteEpisode}
  />
);

AnimeView.propTypes = {
  itemId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  historyItems: PropTypes.arrayOf(PropTypes.object),
  loadAnimeById: PropTypes.func.isRequired,
  loadEpisodeForSeries: PropTypes.func.isRequired,
  editEpisode: PropTypes.func.isRequired,
  deleteEpisode: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  itemId: ownProps.match.params.id,
  item: mapStateToEntity(state.entities.anime, ownProps.match.params.id),
  historyItems: mapStateToEntityList(state.entities.episode)
});

const mapDispatchToProps = {
  loadAnimeById,
  loadEpisodeForSeries,
  editEpisode,
  deleteEpisode
};

export default connect(mapStateToProps, mapDispatchToProps)(AnimeView);
