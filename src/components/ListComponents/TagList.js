import PropTypes from 'prop-types';
import React from 'react';

import { ButtonisedNavLink } from 'components/Buttonised';
import ItemList from './ItemList';
import Paths from 'constants/paths';

const TagListItem = ({ item }) => (
  <li className="tag-item">
    <ButtonisedNavLink
      className="ripple"
      to={`${Paths.base}${Paths.tagManagement}${item.id}`}
    >
      {item.name}
    </ButtonisedNavLink>
  </li>
);

const TagList = ({ items }) => (
  <ItemList
    columns={3}
    items={items.map((item) => (
      <TagListItem key={item.id} item={item} />
    ))}
  />
);

TagList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default TagList;
