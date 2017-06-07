import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import BaseView from '../base-view'
import {loadMangaById, loadChapterForSeries} from '../../actions/manga'
import {Strings} from '../../constants/values'

const MangaView = ({ loadMangaById, loadChapterForSeries }) => (
  <BaseView
    type={Strings.manga}
    loadItemById={loadMangaById}
    loadHistoryForSeries={loadChapterForSeries}
  />
)

MangaView.propTypes = {
  loadMangaById: PropTypes.func.isRequired,
  loadChapterForSeries: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  loadMangaById,
  loadChapterForSeries
}

export default connect(
  mapDispatchToProps
)(MangaView)
