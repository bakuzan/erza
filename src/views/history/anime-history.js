import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux'
import BaseHistoryView from './base-history'
import {Strings} from '../../constants/values'
import {mapStateToEntityList} from '../../utils/data'
import { loadEpisodesByDateRange } from '../../actions/episode'

const AnimeHistoryView = ({ items, loadHistory }) => (
  <BaseHistoryView
    type={Strings.anime}
    items={items}
    loadHistory={loadHistory}
  />
)

AnimeHistoryView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  loadHistory: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  items: mapStateToEntityList(state.entities.episode),
})

const mapDispatchToProps = {
  loadHistory: loadEpisodesByDateRange
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnimeHistoryView)
