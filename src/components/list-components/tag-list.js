import PropTypes from 'prop-types';
import React from 'react';
import { ButtonisedNavLink } from 'components/buttonised';
import ItemList from './item-list/item-list';
import { Paths } from '../../constants/paths';

const TagListItem = ({ item }) => (
  <li className="tag-item">
    <ButtonisedNavLink
      className="ripple"
      to={`${Paths.base}${Paths.tagManagement}${item._id}`}
    >
      {item.name}
    </ButtonisedNavLink>
  </li>
);

const TagList = ({ items }) => (
  <ItemList
    className="list column three"
    items={items.map(item => <TagListItem key={item._id} item={item} />)}
  />
);

TagList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default TagList;
