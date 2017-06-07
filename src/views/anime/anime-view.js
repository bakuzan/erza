import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import BaseView from '../base-view'
import {loadAnimeById, loadEpisodeForSeries} from '../../actions/anime'
import {Strings} from '../../constants/values'

const AnimeView = ({ loadAnimeById, loadEpisodeForSeries }) => (
  <BaseView
    type={Strings.anime}
    loadItemById={loadAnimeById}
    loadHistoryForSeries={loadEpisodeForSeries}
  />
)

AnimeView.propTypes = {
  loadAnimeById: PropTypes.func.isRequired,
  loadEpisodeForSeries: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  loadAnimeById,
  loadEpisodeForSeries
}

export default connect(
  mapDispatchToProps
)(AnimeView)
