import React, { PropTypes } from 'react';
import { NavLink } from 'react-router-dom';

const FilterLink = ({ filter, children }) => (
  <NavLink
    to={filter}
    className="button-link"
    activeClassName="active"
  >
    {children}
  </NavLink>
);

FilterLink.propTypes = {
  children: PropTypes.node.isRequired,
  filter: PropTypes.string
}

export default FilterLink;
