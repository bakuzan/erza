import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import PagingControls from '../../containers/paging-controls/paging-controls'
import HistoryList from '../../components/history-list/history-list'
import {Strings} from '../../constants/values'

const PagedHistoryList = ({ filters, items }) => (
  <div className="flex-column flex-grow">
    <PagingControls
      listType={Strings.history}
      filters={filters}
    />
    <HistoryList
        items={items}
    />
  </div>
);

PagedHistoryList.propTypes = {
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
