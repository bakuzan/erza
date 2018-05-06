import PropTypes from 'prop-types';
import React from 'react';
import { ButtonisedNavLink } from 'components/buttonised';

const FilterLink = ({ filter, children }) => (
  <ButtonisedNavLink
    to={filter}
    link
    btnStyle="primary"
    className="filter-link"
    activeClassName="active"
  >
    {children}
  </ButtonisedNavLink>
);

FilterLink.propTypes = {
  children: PropTypes.node.isRequired,
  filter: PropTypes.string
};

export default FilterLink;
