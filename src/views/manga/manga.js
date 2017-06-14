import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import BaseListView from '../base-list'
import {Strings} from '../../constants/values'
import {mapStateToEntityList, mapUrlFilterToEntityObject} from '../../utils/data'
import {loadManga} from '../../actions/manga'

const Manga = ({ location, filter, items, loadManga }) => (
  <BaseListView
    routeKey={location.key}
    type={Strings.manga}
    loadDataForTypedList={loadManga}
    items={items}
    statusFilter={filter}
  />
)

Manga.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  items: mapStateToEntityList(state.entities.manga),
  filter: mapUrlFilterToEntityObject(ownProps.params)
})

const mapDispatchToProps = {
  loadManga
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Manga)
