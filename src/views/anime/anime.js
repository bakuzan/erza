import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Strings} from '../../constants/values'
import {mapStateToEntityList} from '../../utils/data'
import {loadAnime} from '../../actions/anime'

const Anime = ({ items, loadAnime }) => (
  <BaseListView
    type={Strings.anime}
    loadDataForTypedList={loadAnime}
    items={items}
  />
)

Anime.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object)
}

const mapStateToProps = (state, ownProps) => ({
  items: mapStateToEntityList(state.entities.anime)
})

const mapDispatchToProps = {
  loadAnime
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Anime)
