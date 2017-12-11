import PropTypes from 'prop-types';
import React from 'react';
import './item-list.css'

const ItemList = ({ items }) => (
  <ul className="item-list">
    {
      items.length === 0
      ? ( <li> <p>No items to display.</p> </li> )
      : items
    }
  </ul>
);

ItemList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.element).isRequired
}

export default ItemList
