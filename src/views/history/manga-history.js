import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import BaseHistoryView from './base-history'
import {Strings} from '../../constants/values'
import {mapStateToEntityList} from '../../utils/data'
import { loadChaptersByDateRange } from '../../actions/chapter'

const MangaHistoryView = ({ items, loadHistory }) => (
  <BaseHistoryView
    type={Strings.manga}
    items={items}
    loadHistory={loadHistory}
  />
)

MangaHistoryView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  loadHistory: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  items: mapStateToEntityList(state.entities.chapter),
})

const mapDispatchToProps = {
  loadHistory: loadChaptersByDateRange
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MangaHistoryView)
