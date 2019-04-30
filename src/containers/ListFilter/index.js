import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { ClearableInput, Tickbox, SelectBox } from 'mko';
import FilterLink from '../FilterLink';
import SortOrderToggle from 'components/SortOrderToggle';
import { toggleSortOrder, setSortKey } from 'actions/sorting';
import { toggleIsOwnedOnly } from 'actions/filters';
import Enums from 'constants/enums';
import { Paths } from 'constants/paths';

import './ListFilter.scss';

const FILTER_BASE = (type) => `${Paths.base}${Paths[type].list}`;

const SORT_OPTIONS = [
  { text: 'Title', value: 'title' },
  { text: 'Updated date', value: 'updatedAt' }
];

const ListFilter = ({
  type,
  search,
  onChange,
  sorting,
  onSortOrderToggle,
  onChangeSortKey,
  isOwnedOnly,
  onChangeIsOwnedOnly,
  children
}) => {
  const [sortKey, sortOrder] = sorting;
  const filterBase = FILTER_BASE(type);
  const statusLinks = Object.keys(Enums.status).map((status) => (
    <FilterLink key={status} filter={`${filterBase}${status}`}>
      {status}
    </FilterLink>
  ));

  return (
    <div className="list-filter">
      <ClearableInput
        id="search"
        name="search"
        label="Search"
        value={search}
        onChange={onChange}
      />

      <div className="button-group">{statusLinks.slice(0, 3)}</div>
      <div className="button-group">{statusLinks.slice(3)}</div>

      <Tickbox
        text="Owned only"
        id="isOwnedOnly"
        name="isOwnedOnly"
        checked={isOwnedOnly}
        onChange={() => onChangeIsOwnedOnly(type)}
      />

      <SelectBox
        id="sortKey"
        name="sortKey"
        text="sort on"
        value={sortKey}
        onChange={(e) => onChangeSortKey(e)}
        options={SORT_OPTIONS}
      />

      <SortOrderToggle value={sortOrder} onChange={onSortOrderToggle} />

      <div className="list-filter-custom-content">{children}</div>
    </div>
  );
};

ListFilter.propTypes = {
  type: PropTypes.string.isRequired,
  search: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  sorting: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSortOrderToggle: PropTypes.func.isRequired,
  onChangeSortKey: PropTypes.func.isRequired,
  isOwnedOnly: PropTypes.bool.isRequired,
  onChangeIsOwnedOnly: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  sorting: state.sorting,
  isOwnedOnly: state.filters[ownProps.type].isOwnedOnly
});

const mapDispatchToProps = {
  onSortOrderToggle: toggleSortOrder,
  onChangeSortKey: setSortKey,
  onChangeIsOwnedOnly: toggleIsOwnedOnly
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListFilter);
