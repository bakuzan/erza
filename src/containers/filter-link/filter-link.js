import React from 'react';
import { Link } from 'react-router';

const FilterLink = ({ filter, children }) => (
  <Link
    to={filter}
    className="button-link"
    activeClassName="active"
  >
    {children}
  </Link>
);

export default FilterLink;
