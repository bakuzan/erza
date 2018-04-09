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
      isDialogOpen: null
    };

    this.openEditDialog = this.openEditDialog.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  openEditDialog(_id) {
    this.setState({ isDialogOpen: _id });
  }

  handleEdit(event) {
    this.props.addHistoryToItem(this.state);
    this.setState({ isDialogOpen: null });
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
          isOpen={!!this.state.isDialogOpen}
          type={type}
          seriesId={this.state.isDialogOpen}
          onSubmit={this.handleEdit}
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
