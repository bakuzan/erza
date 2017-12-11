import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux'

import BaseView from '../base-view'
import {loadAnimeById} from '../../actions/anime'
import {loadEpisodeForSeries, editEpisode, deleteEpisode} from '../../actions/episode'
import {mapStateToEntity, mapStateToEntityList} from '../../utils/data'
import {Strings} from '../../constants/values'

const AnimeView = ({ itemId, item, history, loadAnimeById, loadEpisodeForSeries, editEpisode, deleteEpisode }) => (
  <BaseView
    type={Strings.anime}
    itemId={itemId}
    item={item}
    history={history}
    loadItemById={loadAnimeById}
    loadHistoryForSeries={loadEpisodeForSeries}
    editAction={editEpisode}
    deleteAction={deleteEpisode}
  />
)

AnimeView.propTypes = {
  itemId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  history: PropTypes.arrayOf(PropTypes.object),
  loadAnimeById: PropTypes.func.isRequired,
  loadEpisodeForSeries: PropTypes.func.isRequired,
  editEpisode: PropTypes.func.isRequired,
  deleteEpisode: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  itemId: ownProps.params.id,
  item: mapStateToEntity(state.entities.anime, ownProps.params.id),
  history: mapStateToEntityList(state.entities.episode)
})

const mapDispatchToProps = {
  loadAnimeById,
  loadEpisodeForSeries,
  editEpisode,
  deleteEpisode
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnimeView)
