import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import FilterLink from '../filter-link/filter-link'
import RadioButton from '../../components/radio-button/radio-button'
import ClearableInput from '../../components/clearable-input/clearable-input'
import {toggleSortOrder, setSortKey} from '../../actions/sorting'
import {Strings} from '../../constants/values'
import {Paths} from '../../constants/paths'
import './list-filter.css'

const FILTER_BASE = type => `${Paths.base}${Paths[type].list}`;
const ALL_FILTER = type => `${FILTER_BASE(type)}${Strings.filters.all}`;
const COMPLETED_FILTER = type => `${FILTER_BASE(type)}${Strings.filters.completed}`;
const ONGOING_FILTER = type => `${FILTER_BASE(type)}${Strings.filters.ongoing}`;

const ListFilter = ({ type, search, isAdult, onChange, sortOrder, onSortOrderToggle, sortKey, onChangeSortKey }) => (
  <div className="list-filter">

    <ClearableInput
      value={search}
      onChange={onChange}
    />

    <div className="button-group">
      <FilterLink filter={ALL_FILTER(type)}>
      { Strings.filters.all }
      </FilterLink>
      <FilterLink filter={COMPLETED_FILTER(type)}>
      { Strings.filters.completed }
      </FilterLink>
      <FilterLink filter={ONGOING_FILTER(type)}>
      { Strings.filters.ongoing }
      </FilterLink>
    </div>

    <div className="has-float-label select-container">
      <select className="select-box"
              name="sortKey"
              value={sortKey}
              onChange={(e) => onChangeSortKey(e)}
      >
        {
          [
            { text: 'Title', value: 'title' },
            { text: 'Updated date', value: 'updatedDate' }
          ].map(item => {
            return (
              <option key={item.value} value={item.value}>
                { item.text }
              </option>
            );
          })
        }
      </select>
      <label>sort on</label>
    </div>
    <div className="radio-group" role="radiogroup">
      <RadioButton
        name="sortOrder"
        label={Strings.ascending}
        value={Strings.ascending}
        checked={sortOrder === Strings.ascending}
        onSelect={(e) => onSortOrderToggle(e)}
      />
      <RadioButton
        name="sortOrder"
        label={Strings.descending}
        value={Strings.descending}
        checked={sortOrder === Strings.descending}
        onSelect={(e) => onSortOrderToggle(e)}
      />
    </div>
  </div>
);

ListFilter.propTypes = {
  type: PropTypes.string.isRequired,
  search: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onSortOrderToggle: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  onChangeSortKey: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  sortKey: state.sorting.sortKey,
  sortOrder: state.sorting.sortOrder
})

const mapDispatchToProps = ({
  onSortOrderToggle: toggleSortOrder,
  onChangeSortKey: setSortKey
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListFilter)
