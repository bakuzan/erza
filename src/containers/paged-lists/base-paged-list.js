import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import PagingControls from '../../containers/paging-controls/paging-controls';
import QuickAdd from '../../containers/quick-add';

import { capitalise } from '../../utils/common';
import { getUniquePropertiesForItemType } from '../../utils/data';

class BasePagedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isQuickAddOpen: null
    };

    this.openEditDialog = this.openEditDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  openEditDialog(_id) {
    this.setState({ isQuickAddOpen: _id });
  }

  closeDialog() {
    this.setState({ isQuickAddOpen: null });
  }

  handleEdit(values) {
    this.props.addHistoryToItem(values);
    this.setState({ isQuickAddOpen: null });
  }

  render() {
    const { type, filters, list, items } = this.props;
    const PagedList = list;
    const { current } = getUniquePropertiesForItemType(type);

    const dynamicListProps = {
      [`add${capitalise(current)}`]: this.openEditDialog
    };

    return (
      <div className="flex-column flex-grow">
        <PagingControls listType={type} filters={filters} />
        <PagedList items={items} {...dynamicListProps} />
        <QuickAdd
          isOpen={!!this.state.isQuickAddOpen}
          type={type}
          seriesId={this.state.isQuickAddOpen}
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
  paging: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ paging: state.paging });

export default connect(mapStateToProps)(BasePagedList);
