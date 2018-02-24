import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import ItemList from './item-list/item-list';
import { Paths } from '../../constants/paths';

const TagListItem = ({ item }) => (
  <li className="tag-item">
    <NavLink
      className="button-link ripple"
      to={`${Paths.base}${Paths.tagManagement}${item._id}`}
    >
      {item.name}
    </NavLink>
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
