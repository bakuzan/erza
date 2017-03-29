import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import FilterLink from '../filter-link/filter-link'
import RadioButton from '../../components/radio-button/radio-button'
import {toggleSortOrder, setSortKey} from '../../actions/list-settings'
import {Strings} from '../../constants/values'
import {Paths} from '../../constants/paths'
import './list-filter.css'

const FILTER_BASE = `${Paths.base}${Paths.anime.list}`;
const ALL_FILTER = `${FILTER_BASE}${Strings.filters.all}`;
const COMPLETED_FILTER = `${FILTER_BASE}${Strings.filters.completed}`;
const ONGOING_FILTER = `${FILTER_BASE}${Strings.filters.ongoing}`;

const ListFilter = ({ search, onChange, sortOrder, onSortOrderToggle, sortKey, onChangeSortKey }) => (
  <div className="list-filter">

    <div className="has-float-label input-container">
      <input type="text"
             name="search"
             placeholder="search"
             value={search}
             onChange={onChange}
             autoFocus
             autoComplete="false"
      />
      <label>search</label>
    </div>

    <div className="button-group">
      <FilterLink filter={ALL_FILTER}>
      { Strings.filters.all }
      </FilterLink>
      <FilterLink filter={COMPLETED_FILTER}>
      { Strings.filters.completed }
      </FilterLink>
      <FilterLink filter={ONGOING_FILTER}>
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
)

ListFilter.PropTypes = {
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
