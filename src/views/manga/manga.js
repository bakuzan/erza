import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Strings} from '../../constants/values'
import {mapStateToEntityList} from '../../utils/data'
import {loadManga} from '../../actions/manga'

const Manga = ({ items, loadManga }) => (
  <BaseListView
    type={Strings.manga}
    loadDataForTypedList={loadManga}
    items={items}
  />
)

Manga.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object)
}

const mapStateToProps = (state, ownProps) => ({
  items: mapStateToEntityList(state.entities.manga)
})

const mapDispatchToProps = {
  loadManga
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Manga)
