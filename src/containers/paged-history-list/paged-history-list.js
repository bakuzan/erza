import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import PagingControls from '../../containers/paging-controls/paging-controls';
import HistoryList from '../../components/list-components/history-list/history-list';
import { pageSizes } from '../../constants/values';
import { getHistoryNameForItemType, selectPageItems } from '../../utils/data';

const PagedHistoryList = ({ isFetching, filters, items, type, paging }) => {
  const historyType = getHistoryNameForItemType(type);
  const itemsForPage = selectPageItems(items, historyType, paging);
  return (
    <div className="flex-column flex-grow">
      <PagingControls
        pageSizeOptions={pageSizes.history}
        listType={historyType}
        filters={filters}
      />
      <HistoryList isFetching={isFetching} type={type} items={itemsForPage} />
    </div>
  );
};

PagedHistoryList.propTypes = {
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object,
  paging: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  paging: state.paging[getHistoryNameForItemType(ownProps.type)]
});

export default connect(mapStateToProps)(PagedHistoryList);
