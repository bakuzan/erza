import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux'

import BaseListView from '../base-list'
import {Strings} from '../../constants/values'
import {mapStateToEntityList, mapUrlFilterToEntityObject} from '../../utils/data'
import {loadAnime} from '../../actions/anime'

const Anime = ({ filter, items, loadAnime }) => (
  <BaseListView
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
  filter: mapUrlFilterToEntityObject(ownProps.match.params),
  test: (() => console.log("%c props!! ","color: purple", ownProps))()
})

const mapDispatchToProps = {
  loadAnime
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Anime)
