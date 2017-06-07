import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import BaseView from '../base-view'
import {loadMangaById} from '../../actions/manga'
import {loadChapterForSeries} from '../../actions/chapter'
import {mapStateToEntity, mapStateToEntityList} from '../../utils/data'
import {Strings} from '../../constants/values'

const MangaView = ({ itemId, item, history, loadMangaById, loadChapterForSeries }) => (
  <BaseView
    type={Strings.manga}
    itemId={itemId}
    item={item}
    history={history}
    loadItemById={loadMangaById}
    loadHistoryForSeries={loadChapterForSeries}
  />
)

MangaView.propTypes = {
  itemId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  history: PropTypes.arrayOf(PropTypes.object),
  loadMangaById: PropTypes.func.isRequired,
  loadChapterForSeries: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  itemId: ownProps.params.id,
  item: mapStateToEntity(state.entities.manga, ownProps.params.id),
  history: mapStateToEntityList(state.entities.chapter)
})

const mapDispatchToProps = {
  loadMangaById,
  loadChapterForSeries
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MangaView)
