import React from 'react';

import FilterLink from 'containers/FilterLink';
import { Strings } from 'constants/values';

const ContentTypeFilters = ({ baseUrl }) => (
  <div className="button-group button-group--left">
    <FilterLink filter={`${baseUrl}${Strings.anime}`}>
      {Strings.anime}
    </FilterLink>
    <FilterLink filter={`${baseUrl}${Strings.manga}`}>
      {Strings.manga}
    </FilterLink>
  </div>
);

export default ContentTypeFilters;
