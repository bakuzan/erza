import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { ClearableInput, Tickbox, RadioButton, SelectBox } from 'mko';
import FilterLink from '../FilterLink';
import { toggleSortOrder, setSortKey } from 'actions/sorting';
import { toggleIsOwnedOnly } from 'actions/filters';
import { Strings, Enums } from 'constants/values';
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

      <div className="radio-group" role="radiogroup">
        <RadioButton
          id="sort-order-asc"
          name="sortOrder"
          label={Strings.ascending}
          value={Strings.ascending}
          checked={sortOrder === Strings.ascending}
          onChange={(e) => onSortOrderToggle(e)}
        />
        <RadioButton
          id="sort-order-desc"
          name="sortOrder"
          label={Strings.descending}
          value={Strings.descending}
          checked={sortOrder === Strings.descending}
          onChange={(e) => onSortOrderToggle(e)}
        />
      </div>
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