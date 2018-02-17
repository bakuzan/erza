import PropTypes from 'prop-types';
import React from 'react';
import ItemList from './item-list/item-list';

const TagListItem = ({ item, onClick }) => (
  <li className="tag-item">
    <button type="button" className="button ripple" onClick={onClick}>
      {item.name}
    </button>
  </li>
);

const TagList = ({ items, onClick }) => (
  <ItemList
    items={items.map(item => (
      <TagListItem
        key={item._id}
        item={item}
        onClick={() => onClick(item._id)}
      />
    ))}
  />
);

TagList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func.isRequired
};

export default TagList;
