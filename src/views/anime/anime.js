import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import BaseListView from '../base-list'
import {Strings} from '../../constants/values'
import {mapStateToEntityList, mapUrlFilterToEntityObject} from '../../utils/data'
import {loadAnime} from '../../actions/anime'

const Anime = ({ location, filter, items, loadAnime }) => (
  <BaseListView
    routeKey={location.key}
    type={Strings.anime}
    loadDataForTypedList={loadAnime}
    items={items}
    statusFilter={filter}
  />
)

Anime.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  items: mapStateToEntityList(state.entities.anime),
  filter: mapUrlFilterToEntityObject(ownProps.params)
})

const mapDispatchToProps = {
  loadAnime
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Anime)
