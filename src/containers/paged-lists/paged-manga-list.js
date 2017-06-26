import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import MangaList from '../../components/list-components/manga-list/manga-list'
import BasePagedList from './base-paged-list'
import {Strings} from '../../constants/values'
import {addChapters} from '../../actions/manga'

const PagedMangaList = ({ items, filters, addChapters }) => (
  <BasePagedList
    type={String.manga}
    list={MangaList}
    items={items}
    filter={filters}
    addHistoryToItem={addChapters}
  />
)

PagedMangaList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object,
  addHistoryToItem: PropTypes.func.isRequried
}

const mapDispatchToProps = {
  addChapters
}

export default connect(
  mapDispatchToProps
)(PagedMangaList)
