import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import BaseListView from '../base-list'
import {Strings} from '../../constants/values'
import {mapStateToEntityList, mapUrlFilterToEntityObject} from '../../utils/data'
import {loadManga} from '../../actions/manga'

const Manga = ({ routeKey, filter, items, loadManga }) => (
  <BaseListView
    routeKey={routeKey}
    type={Strings.manga}
    loadDataForTypedList={loadManga}
    items={items}
    statusFilter={filter}
  />
)

Manga.propTypes = {
  routeKey: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  routeKey: ownProps.location.key,
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
