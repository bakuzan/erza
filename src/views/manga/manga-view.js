import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import BaseView from '../base-view'
import {loadMangaById} from '../../actions/manga'
import {loadChapterForSeries, deleteChapter} from '../../actions/chapter'
import {mapStateToEntity, mapStateToEntityList} from '../../utils/data'
import {Strings} from '../../constants/values'

const MangaView = ({ itemId, item, history, loadMangaById, loadChapterForSeries, deleteChapter }) => (
  <BaseView
    type={Strings.manga}
    itemId={itemId}
    item={item}
    history={history}
    loadItemById={loadMangaById}
    loadHistoryForSeries={loadChapterForSeries}
    deleteAction={deleteChapter}
  />
)

MangaView.propTypes = {
  itemId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  history: PropTypes.arrayOf(PropTypes.object),
  loadMangaById: PropTypes.func.isRequired,
  loadChapterForSeries: PropTypes.func.isRequired,
  deleteChapter: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  itemId: ownProps.params.id,
  item: mapStateToEntity(state.entities.manga, ownProps.params.id),
  history: mapStateToEntityList(state.entities.chapter)
})

const mapDispatchToProps = {
  loadMangaById,
  loadChapterForSeries,
  deleteChapter
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MangaView)
