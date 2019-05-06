import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import PagingControls from 'containers/PagingControls';
import HistoryList from 'components/ListComponents/HistoryList';
import { pageSizes } from 'constants/values';
import { getHistoryNameForItemType } from 'utils/data';

const PagedHistoryList = ({
  isFetching,
  filters,
  items,
  type,
  paging,
  onLoadMore,
  ...props
}) => {
  const historyType = getHistoryNameForItemType(type);
  const itemsForPage = items; // selectPageItems(items, historyType, paging);
  return (
    <div className="flex flex--column flex--grow">
      <PagingControls
        pageSizeOptions={pageSizes.history}
        listType={historyType}
        filters={filters}
      />
      <HistoryList
        isFetching={isFetching}
        type={type}
        items={itemsForPage}
        editAction={props.editAction}
        deleteAction={props.deleteAction}
        onLoadMore={onLoadMore}
      />
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
