import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import BaseView from '../base-view'
import {loadAnimeById} from '../../actions/anime'
import {loadEpisodeForSeries} from '../../actions/episode'
import {mapStateToEntity, mapStateToEntityList} from '../../utils/data'
import {Strings} from '../../constants/values'

const AnimeView = ({ itemId, item, history, loadAnimeById, loadEpisodeForSeries }) => (
  <BaseView
    type={Strings.anime}
    itemId={itemId}
    item={item}
    history={history}
    loadItemById={loadAnimeById}
    loadHistoryForSeries={loadEpisodeForSeries}
  />
)

AnimeView.propTypes = {
  itemId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  history: PropTypes.arrayOf(PropTypes.object),
  loadAnimeById: PropTypes.func.isRequired,
  loadEpisodeForSeries: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  itemId: ownProps.params.id,
  item: mapStateToEntity(state.entities.anime, ownProps.params.id),
  history: mapStateToEntityList(state.entities.episode)
})

const mapDispatchToProps = {
  loadAnimeById,
  loadEpisodeForSeries
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnimeView)
