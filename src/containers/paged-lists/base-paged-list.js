import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import PagingControls from '../../containers/paging-controls/paging-controls';
import QuickAdd from '../../components/quick-add/quick-add';

import { capitalise } from '../../utils/common';
import { getUniquePropertiesForItemType } from '../../utils/data';

const EMPTY_OBJECT = {};

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
    const editItem =
      items.find(x => x._id === this.state.isDialogOpen) || EMPTY_OBJECT;

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
          originalItem={editItem}
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
