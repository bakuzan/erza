import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import PagingControls from 'containers/PagingControls';
import QuickAdd from 'containers/QuickAdd';

class BasePagedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemIdForQuickAdd: null
    };

    this.openEditDialog = this.openEditDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  openEditDialog(id) {
    this.setState({ itemIdForQuickAdd: id });
  }

  closeDialog() {
    this.setState({ itemIdForQuickAdd: null });
  }

  handleEdit(values) {
    this.props.addHistoryToItem(values);
    this.setState({ itemIdForQuickAdd: null });
  }

  render() {
    const {
      containerClassName,
      isFetching,
      type,
      filters,
      list,
      items,
      onLoadMore,
      startSeries
    } = this.props;

    const PagedList = list;
    const isQuickAddOpen = !!this.state.itemIdForQuickAdd;
    const itemsForPage = items; //selectPageItems(items, type, paging);

    return (
      <div className="flex flex--column flex--grow">
        <PagingControls
          className={containerClassName}
          listType={type}
          filters={filters}
        />
        <PagedList
          containerClassName={containerClassName}
          isFetching={isFetching}
          items={itemsForPage}
          addAction={this.openEditDialog}
          startAction={startSeries}
          onLoadMore={onLoadMore}
        />
        <QuickAdd
          isOpen={isQuickAddOpen}
          type={type}
          seriesId={this.state.itemIdForQuickAdd}
          onSubmit={this.handleEdit}
          onClose={this.closeDialog}
        />
      </div>
    );
  }
}

BasePagedList.propTypes = {
  type: PropTypes.string.isRequired,
  list: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  startSeries: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching
});

export default connect(mapStateToProps)(BasePagedList);
