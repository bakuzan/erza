import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import BasePagedList from './base-paged-list'
import {Strings} from '../../constants/values'
import {addEpisodes} from '../../actions/anime'

const PagedAnimeList = ({ items, filters, addEpisodes }) => (
  <BasePagedList
    type={String.anime}
    items={items}
    filter={filters}
    addHistoryToItem={addEpisodes}
  />
)

PagedAnimeList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object,
  addHistoryToItem: PropTypes.func.isRequried
}

const mapDispatchToProps = {
  addEpisodes
}

export default connect(
  mapDispatchToProps
)(PagedAnimeList)
