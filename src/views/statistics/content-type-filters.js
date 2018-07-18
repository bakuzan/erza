import React from 'react';

import FilterLink from '../../containers/filter-link/filter-link';
import { Paths } from '../../constants/paths';
import { Strings } from '../../constants/values';

const ContentTypeFilters = () => (
  <div className="button-group satellizer-content-types">
    <FilterLink filter={`${Paths.base}${Paths.statistics}${Strings.anime}`}>
      {Strings.anime}
    </FilterLink>
    <FilterLink filter={`${Paths.base}${Paths.statistics}${Strings.manga}`}>
      {Strings.manga}
    </FilterLink>
  </div>
);

export default ContentTypeFilters;
