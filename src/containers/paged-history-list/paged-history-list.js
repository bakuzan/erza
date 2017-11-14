import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import PagingControls from '../../containers/paging-controls/paging-controls'
import HistoryList from '../../components/list-components/history-list/history-list'
import {pageSizes} from '../../constants/values'
import {getHistoryNameForItemType} from '../../utils/data'

const PagedHistoryList = ({ filters, items, type }) => (
  <div className="flex-column flex-grow">
    <PagingControls
      pageSizeOptions={pageSizes.history}
      listType={getHistoryNameForItemType(type)}
      filters={filters}
    />
    <HistoryList
        type={type}
        items={items}
    />
  </div>
);

PagedHistoryList.propTypes = {
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object,
  paging: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  paging: state.paging
})

export default connect(
  mapStateToProps
)(PagedHistoryList)
