import React from 'react';

import FilterLink from 'containers/FilterLink';
import { Strings } from 'constants/values';

const ContentTypeFilters = ({ baseUrl, children }) => (
  <div className="button-group button-group--left" style={{ margin: 0 }}>
    <FilterLink filter={`${baseUrl}${Strings.anime}`}>
      {Strings.anime}
    </FilterLink>
    <FilterLink filter={`${baseUrl}${Strings.manga}`}>
      {Strings.manga}
    </FilterLink>
    {children && <div className="flex-spacer"></div>}
    {children}
  </div>
);

export default ContentTypeFilters;
