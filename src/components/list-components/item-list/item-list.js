import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import './item-list.css';

const ItemList = ({ className, items }) => (
  <ul className={classNames('item-list', className)}>
    {items.length === 0 ? (
      <li>
        {' '}
        <p>No items to display.</p>{' '}
      </li>
    ) : (
      items
    )}
  </ul>
);

ItemList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default ItemList;
