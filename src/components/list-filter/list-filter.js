import React from 'react'
import FilterLink from '../../containers/filter-link/filter-link'
import {Strings} from '../../constants/strings'
import {Paths} from '../../constants/paths'
import './list-filter.css'

const FILTER_BASE = `${Paths.base}${Paths.anime.list}`;
const ALL_FILTER = `${FILTER_BASE}${Strings.filters.all}`;
const COMPLETED_FILTER = `${FILTER_BASE}${Strings.filters.completed}`;
const ONGOING_FILTER = `${FILTER_BASE}${Strings.filters.ongoing}`;

const ListFilter = () => (
  <div className="list-filter">
    <div className="has-float-label input-container">
      <input type="text"
             placeholder="search"
             autoFocus
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
  </div>
)

export default ListFilter
