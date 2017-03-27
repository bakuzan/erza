import React from 'react'
import FilterLink from '../../containers/filter-link/filter-link'
import {Strings} from '../../constants/values'
import {Paths} from '../../constants/paths'
import './list-filter.css'

const FILTER_BASE = `${Paths.base}${Paths.anime.list}`;
const ALL_FILTER = `${FILTER_BASE}${Strings.filters.all}`;
const COMPLETED_FILTER = `${FILTER_BASE}${Strings.filters.completed}`;
const ONGOING_FILTER = `${FILTER_BASE}${Strings.filters.ongoing}`;

const ListFilter = ({ search, onChange, sortOrder, sortOrderToggle, sortKey, sortKeyChange }) => (
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
              selected={sortKey}
              onChange={(e) => sortKeyChange(e)}
      >
        {
          [
            { text: 'Title', value: 'title' },
            { text: 'Update date', value: 'updateDate' }
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
      <label>
        <input type="radio"
               name="sortOrder"
               value={Strings.ascending}
               checked={sortOrder === Strings.ascending}
               onChange={(e) => sortOrderToggle(e)}
         />
         <span>{ Strings.ascending }</span>
      </label>
      <label>
        <input type="radio"
               name="sortOrder"
               value={Strings.descending}
               checked={sortOrder === Strings.descending}
               onChange={(e) => sortOrderToggle(e)}
         />
         <span>{ Strings.descending }</span>
      </label>
    </div>

  </div>
)

export default ListFilter
