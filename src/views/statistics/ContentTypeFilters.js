import React from 'react';

import FilterLink from 'containers/FilterLink';
import { Paths } from 'constants/paths';
import { Strings } from 'constants/values';

const ContentTypeFilters = () => (
  <div className="button-group button-group--left">
    <FilterLink filter={`${Paths.base}${Paths.statistics}${Strings.anime}`}>
      {Strings.anime}
    </FilterLink>
    <FilterLink filter={`${Paths.base}${Paths.statistics}${Strings.manga}`}>
      {Strings.manga}
    </FilterLink>
  </div>
);

export default ContentTypeFilters;
