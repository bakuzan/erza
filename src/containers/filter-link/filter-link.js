import React, { PropTypes } from 'react';
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

FilterLink.propTypes = {
  children: PropTypes.node.isRequired,
  filter: PropTypes.string
}

export default FilterLink;
